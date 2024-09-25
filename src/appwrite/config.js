import config from '../config/config.js'
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  databases;
  storage;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    const isValidSlug = /^[a-zA-Z0-9_.-]{1,36}$/.test(slug);

    if (!isValidSlug) {
      console.error("Invalid slug for documentId:", slug);
      throw "Invalid slug for documentId";
    }
    
    try {
      return await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId,
        }
      )
    } catch (error) {
      console.log("Appwrite serive :: createPost :: error", error);
    }
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      )
    } catch (error) {
      console.log("Appwrite serive :: updatePost :: error", error);
      throw error
    }
  }

  async deletePost(slug) {
    try {
      return await this.databases.deleteDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug
      )
    } catch (error) {
      console.log("Appwrite serive :: deletePost :: error", error);
      return false
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug
      )
    } catch (error) {
      console.log("Appwrite serive :: getPost :: error", error);
      return false
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        queries,
      )
    } catch (error) {
      console.log("Appwrite serive :: getPosts :: error", error);
      return false
    }
  }


  // ==================================================================================================================
  // ==========================================file upload service=====================================================
  // ==================================================================================================================

  async uploadFile(file) {
    try {
      return await this.storage.createFile(
        config.appwriteBucketId,
        ID.unique(),
        file,
      );
    } catch (error) {
      console.log("Appwrite serive :: uploadFile :: error", error);
      return false
    }
  }

  async deleteFile(fileId) {
    try {
      return await this.storage.deleteFile(
        config.appwriteBucketId,
        fileId
      );
    } catch (error) {
      console.log("Appwrite serive :: deleteFile :: error", error);
      return false
    }
  }

  getFilePreview(fileId) {
    return this.storage.getFilePreview(
      config.appwriteBucketId,
      fileId
    )
  }
}

const appwriteService = new Service()
export default appwriteService