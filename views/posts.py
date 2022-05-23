from flask import Response, request
from flask_restful import Resource
from models import Post, db
from views import get_authorized_user_ids
import flask_jwt_extended

import json

def get_path():
    return request.host_url + 'api/posts/'

class PostListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
    def get(self):  #HTTP GET
        args = request.args 

        # alternative method
        user_ids = get_authorized_user_ids(self.current_user)

        try:
            lim = int(args.get("limit") or 20) # 20 is default if get fails
        except: 
            # could not successfully convert string to int
            return Response(json.dumps({"message": "the limit parameter is invalid"}), mimetype="application/json", status=400)
        if lim > 50:
            return Response(json.dumps({"message": "the limit parameter is invalid"}), mimetype="application/json", status=400)

        #posts = Post.query.limit(limit).all()
        posts = Post.query.filter(Post.user_id.in_(user_ids)).limit(lim).all()
        posts_json = [post.to_dict() for post in posts]
        return Response(json.dumps(posts_json), mimetype="application/json", status=200)

    @flask_jwt_extended.jwt_required()
    def post(self):   #HTTP POST
        # create a new post based on the data posted in the body 
        body = request.get_json()

        if not body.get('image_url'):
            return Response(json.dumps({'message': "'image_url' is required"}), mimetype="application/json", status=400)

        # 1. Create:
        new_post = Post(
            image_url=body.get('image_url'),
            user_id=self.current_user.id, # must be a valid user_id or will throw an error
            caption=body.get('caption'),
            alt_text=body.get('alt_text')
        )
        db.session.add(new_post)    # issues the insert statement
        db.session.commit()         # commits the change to the database 

        return Response(json.dumps(new_post.to_dict()), mimetype="application/json", status=201)
        
class PostDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
        
    @flask_jwt_extended.jwt_required()
    def patch(self, id):
        # update post based on the data posted in the body 
        body = request.get_json()
        post = Post.query.get(id)

        if not post:
            return Response(json.dumps({'message': 'id={0} is invalid'.format(id)}), mimetype="application/json", status=404)            

        user_ids = get_authorized_user_ids(self.current_user)
        if post.user_id not in user_ids:
            return Response(json.dumps({'message': 'id={0} is invalid'.format(id)}), mimetype="application/json", status=404)

        if body.get('image_url'):
            post.image_url = body.get('image_url')
        if body.get('caption'):
            post.caption = body.get('caption')
        if body.get('alt_text'):
            post.alt_text = body.get('alt_text')

        db.session.commit()         # commits the change to the database    
        
        return Response(json.dumps(post.to_dict()), mimetype="application/json", status=200)


    @flask_jwt_extended.jwt_required()
    def delete(self, id):
        # delete post where "id"=id
        post = Post.query.get(id)
        if not post:
            return Response(json.dumps({'message': 'id={0} is invalid'.format(id)}), mimetype="application/json", status=404)

        if post.user_id != self.current_user.id:
            return Response(json.dumps({'message': 'id={0} is invalid'.format(id)}), mimetype="application/json", status=404)

        Post.query.filter_by(id=id).delete()
        db.session.commit()

        return Response(json.dumps({'message': 'Post {0} was successfully deleted'.format(id)}), mimetype="application/json", status=200)


    @flask_jwt_extended.jwt_required()
    def get(self, id):
        # get the post based on the id
        post = Post.query.get(id)
        if not post:
            return Response(json.dumps({'message': 'id={0} is invalid'.format(id)}), mimetype="application/json", status=404)
        
        user_ids = get_authorized_user_ids(self.current_user)
        if post.user_id not in user_ids:
            return Response(json.dumps({'message': 'id={0} is invalid'.format(id)}), mimetype="application/json", status=404)

        return Response(json.dumps(post.to_dict()), mimetype="application/json", status=200)

def initialize_routes(api):
    api.add_resource(
        PostListEndpoint, 
        '/api/posts', '/api/posts/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
    api.add_resource(
        PostDetailEndpoint, 
        '/api/posts/<int:id>', '/api/posts/<int:id>/',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )