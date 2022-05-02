from flask import Response, request
from flask_restful import Resource
from models import Following, User, db
import json

def get_path():
    return request.host_url + 'api/posts/'

class FollowingListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        # return all of the "following" records that the current user is following
        following_list = Following.query.filter_by(user_id=self.current_user.id).all()
        following_json = [user.to_dict_following() for user in following_list]

        return Response(json.dumps(following_json), mimetype="application/json", status=200)

    def post(self):
        # create a new "following" record based on the data posted in the body 
        body = request.get_json()
        if not body.get('user_id'):
            return Response(json.dumps({'message': "'user_id' is required"}), mimetype="application/json", status=400)
        # Checks to see if user_id is an int
        try:
            id = int(body.get('user_id'))
        except:
            return Response(json.dumps({'message': "the user_id parameter is invalid"}), mimetype="application/json", status=400)
        # Checks if user_id is a valid user
        if not User.query.get(id):
            return Response(json.dumps({'message': "the user_id parameter is invalid"}), mimetype="application/json", status=404)
        # Checks if following exists (cant have duplicates)
        if Following.query.filter_by(user_id=self.current_user.id, following_id=id).all():
            return Response(json.dumps({'message': "following already exists"}), mimetype="application/json", status=400)

        new_following = Following(
            user_id=self.current_user.id,
            following_id=id
        )

        db.session.add(new_following)    # issues the insert statement
        db.session.commit()         # commits the change to the database 

        return Response(json.dumps(new_following.to_dict_following()), mimetype="application/json", status=201)

class FollowingDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
        # delete "following" record where "id"=id
        following = Following.query.get(id)
        if not following:
            return Response(json.dumps({'message': 'id={0} is invalid'.format(id)}), mimetype="application/json", status=404)

        if following.user_id != self.current_user.id:
            return Response(json.dumps({'message': 'id={0} is invalid'.format(id)}), mimetype="application/json", status=404)

        following.query.filter_by(id=id).delete()
        db.session.commit()

        return Response(json.dumps({'message': 'Following {0} was successfully deleted'.format(id)}), mimetype="application/json", status=200)





def initialize_routes(api):
    api.add_resource(
        FollowingListEndpoint, 
        '/api/following', 
        '/api/following/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
    api.add_resource(
        FollowingDetailEndpoint, 
        '/api/following/<int:id>', 
        '/api/following/<int:id>/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
