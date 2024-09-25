import React, { useEffect, useState } from 'react'
import { Query } from 'appwrite';
import appwriteService from '../appwrite/config';
import { Container, PostCard } from '../components';
import { useSelector } from 'react-redux';

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    appwriteService.getPosts([Query.equal('userId', userData?.$id)])
      .then((posts) => {
        if (posts) {
          setPosts(posts.documents)
        }
      })
  }, [])
  if (posts.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold hover:text-gray-500">
                No posts available.
              </h1>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className='w-full py-8'>
      <Container>
        <div className='flex flex-wrap'>
          {posts.map((post) => (
            <div key={post?.$id} className='p-2 w-1/4'>
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}
