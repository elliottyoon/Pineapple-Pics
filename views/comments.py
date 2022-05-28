from flask import Response, request
from flask_restful import Resource
import json
from models import db, Comment, Post
from views import can_view_post 
import flask_jwt_extended 


class CommentListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def post(self):
        # create a new "Comment" based on the data posted in the body 
        body = request.get_json()
        try:
            post_id = int(body.get("post_id"))
            text = body.get("text")
        except:
            return Response(json.dumps({"message": "Invalid formatting"}), mimetype="application/json", status=400)  
        
        if post_id is not None and text is not None:
            
            post = Post.query.get(post_id)
            if not post:
                return Response(json.dumps({"message": "post not found"}), mimetype="application/json", status=404) 
        
            # post found
            if can_view_post(post_id, self.current_user):
                comment = Comment(text, post.user_id, post_id)
                db.session.add(comment)
                db.session.commit()
                return Response(json.dumps(comment.to_dict()), mimetype="application/json", status=201)
            return Response(json.dumps({"message": "not authorized to comment on post"}), mimetype="application/json", status=404)
        return Response(json.dumps({"message": "missing arguments"}), mimetype="application/json", status=400)
        
class CommentDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
  
    @flask_jwt_extended.jwt_required()
    def delete(self, id):
        # delete "Comment" record where "id"=id
        comment = Comment.query.get(id)
        if not comment:
            return Response(json.dumps({"message": "id={0} is invalid".format(id)}), mimetype="application/json", status=404)
        if comment.user_id != self.current_user.id:
            return Response(json.dumps({"message": "id={0} is invalid".format(id)}), mimetype="application/json", status=404)
        Comment.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps({"message": "comment was successfully deleted"}), mimetype="application/json", status=200)

def initialize_routes(api):
    api.add_resource(
        CommentListEndpoint, 
        '/api/comments', 
        '/api/comments/',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}

    )
    api.add_resource(
        CommentDetailEndpoint, 
        '/api/comments/<int:id>', 
        '/api/comments/<int:id>/',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
