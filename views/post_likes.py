from flask import Response, request
from flask_restful import Resource
from models import LikePost, Post, db
from views import can_view_post
import json
import flask_jwt_extended

class PostLikesListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def post(self):
        # create a new "like_post" based on the data posted in the body 
        body = request.get_json()

        # Checks to see if post_id is in body
        if not body.get('post_id'):
            return Response(json.dumps({'message': "'post_id' is required"}), mimetype="application/json", status=400)

        # Checks to see if post_id is an int
        try:
            id = int(body.get('post_id'))
        except:
            return Response(json.dumps({'message': "the post_id parameter is invalid"}), mimetype="application/json", status=400)

        # Checks if post_id is valid
        if not Post.query.get(id):
            return Response(json.dumps({'message': "the post_id parameter is invalid"}), mimetype="application/json", status=404)

        # Check if user is authorized to like
        if not can_view_post(id, self.current_user):
            return Response(json.dumps({'message': "the post_id parameter is invalid"}), mimetype="application/json", status=404)

        # Checks for dupes
        if LikePost.query.filter_by(user_id=self.current_user.id, post_id=id).all():
            return Response(json.dumps({'message': "like already exists"}), mimetype="application/json", status=400)

        new_like = LikePost(
            user_id=self.current_user.id,
            post_id=body.get('post_id')
        )

        db.session.add(new_like)
        db.session.commit()

        return Response(json.dumps(new_like.to_dict()), mimetype="application/json", status=201)

class PostLikesDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def delete(self, id):
        # delete "like_post" record where "id"=id
        like = LikePost.query.get(id)

        if not like:
            return Response(json.dumps({'message': "like does not exist"}), mimetype="application/json", status=404)

        if like.user_id != self.current_user.id:
            return Response(json.dumps({'message': "you are not authorized to delete this like"}), mimetype="application/json", status=404)

        like.query.filter_by(id=id).delete()
        db.session.commit()

        return Response(json.dumps({'message': 'Like {0} was successfully deleted'.format(id)}), mimetype="application/json", status=200)



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
