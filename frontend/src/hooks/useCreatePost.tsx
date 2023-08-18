import { AuthToken } from "@/types/authToken";
import { CreatePostInput, Post } from "@/types/post";
import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useStorage } from "./useStorage";

type IUseCreatePost = UseMutateFunction<Post, unknown, CreatePostInput, unknown>;

async function createPost(
  post: CreatePostInput,
  tokens: AuthToken | null | undefined
  ): Promise<Post> {
  console.debug('post', post)
  if (!tokens) throw new Error("No authToken");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/articles`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      body: JSON.stringify(post),
    }
  );
  if (!response.ok) throw new Error("Failed on create post request");

  return await response.json().then(r=>r.data);
}

export function useCreatePost(): IUseCreatePost {
  const queryClient = useQueryClient();
  const { getAuthStorage } = useStorage();

  const { mutate: createPostMutation } = useMutation<Post, unknown, CreatePostInput, unknown>(
    (post: CreatePostInput) => createPost(post, getAuthStorage()),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(["post", data.id], data);
      },
      onError: (error) => {
        throw new Error("Failed on sign in request" + error);
      },
    }
  );

  return createPostMutation;
}
