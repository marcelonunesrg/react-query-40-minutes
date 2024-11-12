// 'https://jasonplaceholder.typicode.com/todos';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';  

const App = () => {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      return response.json();
    },
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
  });

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (newPost) => {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(newPost),
      });

      return response.json();
    },
    onSuccess: (newPost) => {
      // queryClient.invalidateQueries({
      //   queryKey: ['posts'],
      // });
      queryClient.setQueryData(['posts'], (oldPosts) => [...oldPosts, newPost]);
    },
    // enabled: false,
  });

  // TODO: Explore useInfinityQuery for continuous lazy loading

  if (error || isError) return <div>Error: {error.message}</div>;

  if (isLoading) return <div>Loading...</div>;

  return <div className="App">
    
    {isPending && <div>Adding Post...</div>}

    <button onClick={() => mutate({ 
      userId: 3000,
      title: 'Post #1', 
      body: 'This is the first post',  
    })}>
      Add Post
    </button>

    {data && data.map((todo) => 
      <div key={todo.id}>
        <h4>ID: {todo.id}</h4>
        <h4>TITLE: {todo.title}</h4>
        <p>{todo.body}</p>
      </div>)}
  </div>;
}

export default App;
