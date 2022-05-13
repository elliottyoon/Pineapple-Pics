from flask import Response, request
from flask_restful import Resource
from models import Post, db
from views import get_authorized_user_ids, can_view_post

import json

def get_path():
    return request.host_url + 'api/posts/'

class PostListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user

    def get(self):
        args = request.args 

        user_ids = get_authorized_user_ids(self.current_user)

        try:
            limit = int(args.get('limit') or 20)
        except:
            return Response(json.dumps({"message": "Limit must be an int"}), mimetype="application/json", status=400)
 
        if limit > 50:
            return Response(json.dumps({"message": "Limit exceeds maximum limit size of 50"}), mimetype="application/json", status=400)
                  
        posts = Post.query.filter(Post.user_id.in_(user_ids)).limit(limit).all()
        posts_dict = [post.to_dict(user=self.current_user) for post in posts] 
        # valid request
        return Response(json.dumps(posts_dict), mimetype="application/json", status=200)

    def post(self):
        # create a new post based on the data posted in the body 
        body = request.get_json()
        image_url = body.get("image_url")
        if not image_url:
            return Response(json.dumps({"messsage": "image does not exist"}), mimetype="application/json", status=400)

        caption = body.get("caption") or None
        alt = body.get("alt_text") or None

        new_post = Post(image_url, self.current_user.id, caption, alt)  
        db.session.add(new_post)
        db.session.commit()

        return Response(json.dumps(new_post.to_dict()), mimetype="application/json", status=201)
        
class PostDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
        

    def patch(self, id):
        # update post based on the data posted in the body 
        body = request.get_json()
        changed = False

        # 1. retrieve the existing post from the database
        post = Post.query.get(id)

        if not post:
            return Response(json.dumps({"message": "id{0} is invalid".format(id)}), mimetype="application/json", status=404)

        if post.user_id != self.current_user.id:
            return Response({"message": "id={0} is invalid".format(id)}, mimetype="application/json", status=404)

        # 2. set the new values
        if body.get('image_url'):
            post.image_url = body.get('image_url')
            changed = True
        if body.get('caption'):
            post.caption = body.get('caption')
            changed = True
        if body.get('alt_text'):
            post.alt_text = body.get('alt_text')
            changed = True 
    
        if not changed:
            return Response(json.dumps({"message": "no changes"}), mimetype="application/json", status=404)

        
        # 3. commit the post back to the database
        db.session.commit()
        return Response(json.dumps(post.to_dict()), mimetype="application/json", status=200)


    def delete(self, id):
        # delete post where "id"=id
        # variable checks
        post = Post.query.get(id)
        if not post:
            return Response(json.dumps({"message": "id={0} is invalid".format(id)}), mimetype="application/json", status=404)
        if post.user_id != self.current_user.id:
            return Response(json.dumps({"message": "id={0} is invalid".format(id)}), mimetype="application/json", status=404)
        Post.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps({"message": "post was successfully deleted"}), mimetype="application/json", status=200)


    def get(self, id):
        # get the post based on the id
        post = Post.query.get(id)
        if not post:
            return Response(json.dumps({"message": "post not found"}), mimetype="application/json", status=404) 
        post = post.to_dict(user=self.current_user)
         # post found
        if can_view_post(id, self.current_user):
            return Response(json.dumps(post), mimetype="application/json", status=200)
        return Response(json.dumps({"message": "user does not have access to view the post"}), mimetype="application/json", status=404)

def initialize_routes(api):
    api.add_resource(
        PostListEndpoint, 
        '/api/posts', '/api/posts/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
    api.add_resource(
        PostDetailEndpoint, 
        '/api/posts/<int:id>', '/api/posts/<int:id>/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )
