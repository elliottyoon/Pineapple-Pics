from flask import Response, request
from flask_restful import Resource
from models import LikePost, Post, db
from views import can_view_post
import json

class PostLikesListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def post(self):
        # create a new "like_post" based on the data posted in the body 
        body = request.get_json()
        print(body)
        try:
            post_id = int(body.get("post_id"))
        except:
            return Response(json.dumps({"message": "Invalid formatting"}), mimetype="application/json", status=400)  
        post = Post.query.get(post_id)
        if not post:
            return Response(json.dumps({"message": "post not found"}), mimetype="application/json", status=404) 

         # post found
        if can_view_post(post_id, self.current_user):
            like = LikePost(post.user_id, post_id)
            db.session.add(like)
            db.session.commit()
            return Response(json.dumps(like.to_dict()), mimetype="application/json", status=201)
        return Response(json.dumps({"message": "not authorized to like post"}), mimetype="application/json", status=404)

class PostLikesDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
        # delete "like_post" where "id"=id
        like = LikePost.query.get(id)
        if not like:
            return Response(json.dumps({"message": "id={0} is invalid".format(id)}), mimetype="application/json", status=404)
        if like.user_id != self.current_user.id:
            return Response(json.dumps({"message": "id={0} is invalid".format(id)}), mimetype="application/json", status=404)
        like.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps({"message": "like was successfully deleted"}), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        PostLikesListEndpoint, 
        '/api/posts/likes', 
        '/api/posts/likes/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )

    api.add_resource(
        PostLikesDetailEndpoint, 
        '/api/posts/likes/<int:id>', 
        '/api/posts/likes/<int:id>/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )
