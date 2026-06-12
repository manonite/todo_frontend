import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

export const authState = {
	user: null,
	token: "",
};

export const setAuthState = (user, token) => {
	authState.user = user;
	authState.token = token;
};

export const clearAuthState = () => {
	authState.user = null;
	authState.token = "";
};

const apiUrl = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_URI ?? "http://localhost:5000";

function Home() {
	const [todos, setTodos] = useState([]);
	const [text, setText] = useState("");
	const [message, setMessage] = useState("");
	const navigate = useNavigate();
	const { token, user } = authState;

	const handleInvalidToken = useCallback(() => {
		clearAuthState();
		navigate("/login", { replace: true });
	}, [navigate]);

	const fetchTodos = useCallback(async () => {
		try {
			const res = await axios.get(`${apiUrl}/todo`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setTodos(res.data);
		} catch (error) {
			if (error.response?.status === 401) {
				handleInvalidToken();
				return;
			}

			setMessage(error.response?.data?.message ?? "Unable to load todos");
		}
	}, [handleInvalidToken, token]);

	useEffect(() => {
		if (!token) {
			navigate("/login", { replace: true });
			return;
		}

		const timerId = window.setTimeout(() => {
			void fetchTodos();
		}, 0);

		return () => window.clearTimeout(timerId);
	}, [token, navigate, fetchTodos]);

	const addTodo = async () => {
		if (!text.trim()) {
			setMessage("Todo text is required");
			return;
		}

		try {
			await axios.post(
				`${apiUrl}/todo`,
				{ text },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			setText("");
			setMessage("");
			fetchTodos();
		} catch (error) {
			if (error.response?.status === 401) {
				handleInvalidToken();
				return;
			}

			setMessage(error.response?.data?.message ?? "Unable to add todo");
		}
	};

	const deleteTodo = async (id) => {
		try {
			await axios.delete(`${apiUrl}/todo/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			fetchTodos();
		} catch (error) {
			if (error.response?.status === 401) {
				handleInvalidToken();
				return;
			}

			setMessage(error.response?.data?.message ?? "Unable to delete todo");
		}
	};

	if (!token) {
		return <Navigate to="/login" replace />;
	}

	return (
		<div style={{ padding: "20px" }}>
			<h2>Todo App</h2>
			<p>{user?.name ? `Welcome, ${user.name}` : "Welcome"}</p>
			{message ? <p>{message}</p> : null}
			<div>
				<input
					type="text"
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder="Enter todo text"
				/>
				<button onClick={addTodo}>Add</button>
			</div>
			<ol>
				{todos.map((todo) => (
					<li key={todo._id}>
						{todo.text}
						<button onClick={() => deleteTodo(todo._id)}>Delete</button>
					</li>
				))}
			</ol>
		</div>
	);
}

export default Home;
