from flask import Response, request
from flask_restful import Resource
from models import Following
import flask_jwt_extended
import json

def get_path():
    return request.host_url + 'api/posts/'

class FollowerListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def get(self):
        '''
        People who are following the current user.
        In other words, select user_id where following_id = current_user.id
        '''
        followers = Following.query.filter(Following.following_id == self.current_user.id).all()
        if followers is not None:
            ret_followers = [follower.to_dict_follower() for follower in followers]
            return Response(json.dumps(ret_followers), mimetype="application/json", status=200)
        return Response(json.dumps({"message": "no followers found"}), mimetype="application/json", status=404) 

def initialize_routes(api):
    api.add_resource(
        FollowerListEndpoint, 
        '/api/followers', 
        '/api/followers/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
