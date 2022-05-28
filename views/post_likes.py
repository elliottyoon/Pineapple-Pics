from flask import Response, request
from flask_restful import Resource
from models import LikePost, db
from views import can_view_post
import flask_jwt_extended 

import json

class PostLikesListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def post(self):
        # create a new "like_post" based on the data posted in the body 
        body = request.get_json()
        print(body)
        try:
            post_id = int(body.get("post_id"))
        except:
            return Response(json.dumps({"message": "Invalid formatting"}), mimetype="application/json", status=400)  

        if can_view_post(post_id, self.current_user):
            # see who liked the post
            post_likes = LikePost.query.filter_by(post_id=post_id).all()
            for p_like in post_likes:
                if p_like.user_id == self.current_user.id:
                    return Response(json.dumps({"message": "Can't like a post that is already liked by user"}), mimetype="application/json", status=400)
            like = LikePost(self.current_user.id, post_id)
            db.session.add(like)
            db.session.commit()
            return Response(json.dumps(like.to_dict()),  mimetype="application/json", status=201)
        return Response(json.dumps({"message": "post not found"}), mimetype="application/json", status=404)

class PostLikesDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required() 
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
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )

    api.add_resource(
        PostLikesDetailEndpoint, 
        '/api/posts/likes/<int:id>', 
        '/api/posts/likes/<int:id>/',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
