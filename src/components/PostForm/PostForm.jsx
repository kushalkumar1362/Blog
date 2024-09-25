import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import appwriteService from '../../appwrite/config'
import { Button, Input, Select, RTE } from '../index'

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      slug: post?.$id || "",
      status: post?.status || "active",
    }
  })
  const navigate = useNavigate()
  const userData = useSelector((state) => state.auth.userData);
  const [error, setError] = useState(null)

  const submit = async (data) => {
    if (post) {
      const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

      if (file) {
        appwriteService.deleteFile(post.featuredImage);
      }
      try {
        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: file ? file.$id : undefined,
        });
  
        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      } catch (error) {
        setError(error.message)
      }
    }
    else {
      const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

      if (file) {
        const fileId = file.$id;
        data.featuredImage = fileId;
        setError("")
        try {
          const dbPost = await appwriteService.createPost({
            ...data,
            userId: userData.$id
          })
          if (dbPost) {
            navigate(`/post/${dbPost.$id}`)
          }
        } catch (error) {
          setError(error)
        }
      }
    }
  }

  const slugTransform = useCallback((value) => {
    if (value && typeof (value) === "string") {
      return value.trim().toLowerCase().replace(/ /g, "-").replace(/[^\w-]/g, "");
    }
    return "";
  }, [])

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue(
          "slug",
          slugTransform(value.title),
          { shouldValidate: true },
        );
      }

      return () => subscription.unsubscribe();
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);


  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Enter your title"
          className="mb-4"
          required
          {...register("title", { required: true })}
        />

        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          readOnly
          {...register("slug", { required: true })}
          onInput={e => setValue(
            "slug",
            slugTransform(e.target.value),
            { shouldValidate: true })}
        />

        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      <div className="w-1/3 px-2">
        <Input
          label="Featured Image:"
          type="file"
          className="mb-4"
          accept="image/png, image/jpeg, image/jpg"
          {...register("image", { required: !post })}
        />

        {post && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
          {post ? "Update" : "Submit"}
        </Button>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

      </div>
    </form >
  )
}

