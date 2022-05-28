from flask import Response, request
from flask_restful import Resource
import flask_jwt_extended
import json

def get_path():
    return request.host_url + 'api/posts/'

class ProfileDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
    def get(self):
        user = self.current_user.to_dict()
        status = 200
        if len(user) == 0:
            status = 404
        return Response(json.dumps(user), mimetype="application/json", status=status)

def initialize_routes(api):
    api.add_resource(
        ProfileDetailEndpoint, 
        '/api/profile', 
        '/api/profile/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
