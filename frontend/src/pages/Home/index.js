import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faEdit, faTrashAlt, faCheck, faPlus, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { api } from "../../services/apiClient";
import { parseCookies } from "nookies";
import { AuthContext } from "../../context/auth"
import TaskFilter from '../../components/TaskFilter';

export const Home = () => {
  const [todos, setTodos] = useState([]);
  const [todosNotCompleted, setTodosNotCompleted] = useState([]);
  const [todosCompleted, setTodosCompleted] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { setUserAuth, signOut, userId } = useContext(AuthContext);
  const [currentFilter, setCurrentFilter] = useState('all');

  useEffect(() => {
    const { "@todoList": token } = parseCookies();
    if (token && userId) { // Verifique se userId está definido
      setUserAuth(true);
      if (currentFilter === "all") {
        api
          .get(`/tasks/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            setTodos(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [userId, currentFilter]);

  const handleFilterChange = (newFilter) => {
    setCurrentFilter(newFilter);

    if (newFilter === "notCompleted") {
      api
        .get(`/tasks/notConcluded/${userId}`)
        .then((response) => {
          console.log(response.data)
          setTodosNotCompleted(response.data);
        })
        .catch((err) => {
          console.log("error FILTER", err);
        });
    }

    if (newFilter === "completed") {
      api
        .get(`/tasks/concluded/${userId}`)
        .then((response) => {
          console.log(response.data)
          setTodosCompleted(response.data);
        })
        .catch((err) => {
          console.log("error FILTER", err);
        });
    }

  };

  const addTodo = () => {
    if (name && description && userId) {
      api.post('/tasks', {
        name: name,
        description: description,
        finished_date: null,
        created_at: new Date().toISOString(),
        userId: userId
      }).then((response) => {
        setTodos([...todos, { ...response.data, isEditing: false }]);
        setTodosNotCompleted([...todosNotCompleted, { ...response.data, isEditing: false }]);
        setTodosCompleted([...todosCompleted, { ...response.data, isEditing: false }]);
        setName('');
        setDescription('');
      }).catch((error) => {
        console.error('Error adding task:', error);
      });
    } else { console.log("n entrou na requisiçao de add") }
  }

  const deleteTodo = (id) => {
    api.delete(`/tasks/${id}`)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
        setTodosNotCompleted(todosNotCompleted.filter((todosNotComplete) => todosNotComplete.id !== id));
        setTodosCompleted(todosCompleted.filter((todosComplete) => todosComplete.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
      });
  }

  const toggleComplete = (id) => {

    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, finished_date: todo.finished_date ? null : new Date().toISOString() } : todo
    );

    const updatedTodosCompleted = todosCompleted.map((todosComplete) =>
      todosComplete.id === id ? { ...todosComplete, finished_date: todosComplete.finished_date ? null : new Date().toISOString() } : todosComplete
    );

    const updatedTodosNotCompleted = todosNotCompleted.map((todosNotComplete) =>
      todosNotComplete.id === id ? { ...todosNotComplete, finished_date: todosNotComplete.finished_date ? null : new Date().toISOString() } : todosNotComplete
    );

    setTodos(updatedTodos);
    setTodosNotCompleted(updatedTodosNotCompleted);
    setTodosCompleted(updatedTodosCompleted);

    const todoToToggle = updatedTodos.find(todo => todo.id === id);
    if (todoToToggle.finished_date) {
      sendTodoToServer(todoToToggle);
    }
    if (todoToToggle.finished_date) {
      api.put(`/tasks/${id}`, { finished_date: todoToToggle.finished_date })
        .catch((error) => {
          console.error('Error updating task:', error);
        });
    }
  }

  const toggleIncomplete = (id, finished_date) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, finished_date: todo.finished_date ? null : new Date().toISOString() } : todo
    );
    const updatedTodosCompleted = todosCompleted.map((todosComplete) =>
      todosComplete.id === id ? { ...todosComplete, finished_date: todosComplete.finished_date ? null : new Date().toISOString() } : todosComplete
    );

    const updatedTodosNotCompleted = todosNotCompleted.map((todosNotComplete) =>
      todosNotComplete.id === id ? { ...todosNotComplete, finished_date: todosNotComplete.finished_date ? null : new Date().toISOString() } : todosNotComplete
    );
    setTodos(updatedTodos);
    setTodosNotCompleted(updatedTodosNotCompleted);
    setTodosCompleted(updatedTodosCompleted);

    if (finished_date) {
      api.put(`/tasks/${id}`, { finished_date: null })
        .catch((error) => {
          console.error('Error updating task:', error);
        });
    }

  }

  const editTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isEditing: true } : todo
    );
    const updatedTodosTaskCompeted = todosCompleted.map((todosComplete) =>
      todosComplete.id === id ? { ...todosComplete, isEditing: true } : todosComplete
    );
    const updatedTodosTaskNotCompeted = todosNotCompleted.map((todosNotComplete) =>
      todosNotComplete.id === id ? { ...todosNotComplete, isEditing: true } : todosNotComplete
    );

    setTodos(updatedTodos);
    setTodosNotCompleted(updatedTodosTaskNotCompeted);
    setTodosCompleted(updatedTodosTaskCompeted);
  }

  const saveEditedTask = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, name: name, description: description, isEditing: false } : todo
    );
    const updatedTodosCompleted = todosCompleted.map((todosComplete) =>
      todosComplete.id === id ? { ...todosComplete, name: name, description: description, isEditing: false } : todosComplete
    );

    const updatedTodosNotCompleted = todosNotCompleted.map((todosNotComplete) =>
      todosNotComplete.id === id ? { ...todosNotComplete, name: name, description: description, isEditing: false } : todosNotComplete
    );


    setTodos(updatedTodos);
    setTodosNotCompleted(updatedTodosNotCompleted);
    setTodosCompleted(updatedTodosCompleted);

    const editedTodo = updatedTodos.find(todo => todo.id === id);
    sendTodoToServer(editedTodo);
  };

  const cancelEdit = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isEditing: false } : todo
    );

    const updatedTodosNotCompleted = todosNotCompleted.map((todosNotComplete) =>
      todosNotComplete.id === id ? { ...todosNotComplete, isEditing: false } : todosNotComplete
    );
    const updatedTodosCompleted = todosCompleted.map((todosComplete) =>
      todosComplete.id === id ? { ...todosComplete, isEditing: false } : todosComplete
    );
    setTodos(updatedTodos);
    setTodosNotCompleted(updatedTodosNotCompleted);
    setTodosCompleted(updatedTodosCompleted);
  };

  const sendTodoToServer = (todo) => {

    api.put(`/tasks/${todo.id}`, {
      name: todo.name,
      description: todo.description,
      finished_date: todo.finished_date,
      created_at: todo.created_at,
    }).catch((error) => {
      console.error('Error updating task:', error);
    });
  }

  return (
    <div className="TodoWrapper">
      <div style={{ marginBottom: '2em', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
        <h1>Gerenciador de Tarefas</h1>
        <div style={{ cursor: 'pointer' }} onClick={signOut}>
          <FontAwesomeIcon color="#fff" icon={faSignOutAlt} />
          <span style={{ color: "#fff", marginLeft: '.3em' }} >Sair</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '.51em' }}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ maxWidth: '150px', border: 'none', background: '#8758ff', color: '#fff', borderRadius: '8px', padding: '1em 1em' }}
        />
        <input
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ maxWidth: '200px', border: 'none', background: '#8758ff', color: '#fff', borderRadius: '8px', padding: '1em 1em' }}
        />
        <button style={{ cursor: 'pointer', border: 'none', background: '#27bf1f', color: '#fff', borderRadius: '8px', padding: '1em 1em', fontWeight: 'bolder' }} onClick={addTodo}> <FontAwesomeIcon icon={faPlus} /> Adicionar Tarefa</button>
        <TaskFilter onChangeFilter={handleFilterChange} />
      </div>
      {/* Mini tabela para exibir as tarefas */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ boxShadow: '50px 10px 250px 10px #8758ff', width: '100%', maxWidth: '800px', minWidth: '600px', marginTop: '1em', borderCollapse: 'collapse', background: '#fff'
        }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', minWidth: '100px', maxWidth: '150px', wordWrap: 'break-word', textAlign: 'left', color: '#8758ff' }}>Nome</th>
              <th style={{ padding: '8px', minWidth: '100px', maxWidth: '200px', wordWrap: 'break-word', textAlign: 'left', color: '#8758ff' }}>Descrição</th>
              <th style={{ padding: '8px', minWidth: '100px', maxWidth: '150px', wordWrap: 'break-word', textAlign: 'left', color: '#8758ff' }}>Criada em</th>
              <th style={{ padding: '8px', minWidth: '100px', maxWidth: '150px', wordWrap: 'break-word', textAlign: 'left', color: '#8758ff' }}>Concluída em</th>
              <th style={{ padding: '8px', minWidth: '100px', maxWidth: '150px', wordWrap: 'break-word', textAlign: 'left', color: '#8758ff' }}>Concluída</th>
              <th style={{ padding: '8px', minWidth: '100px', maxWidth: '150px', wordWrap: 'break-word', textAlign: 'left', color: '#8758ff' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {/* EXIBE TODOS */}
            {currentFilter === "all" && Array.isArray(todos) && todos.map((todo) => (
              <tr key={todo.id}>
                <td style={{ padding: '8px', wordWrap: 'break-word', textAlign: 'left', maxWidth: '150px' }}>
                  {todo.isEditing ?
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ width: '100%', padding: '.4em', background: '#8758ff', border: 'none', borderRadius: '5px', color: '#fff' }}
                      placeholder="Edit name" />
                    :
                    todo.name
                  }
                </td>
                <td style={{ padding: '8px', wordWrap: 'break-word', textAlign: 'left', maxWidth: '200px' }}>
                  {todo.isEditing ?
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      style={{ width: '100%', padding: '.4em', background: '#8758ff', border: 'none', borderRadius: '5px', color: '#fff' }}
                      placeholder="Edit description"
                    />
                    :
                    todo.description
                  }
                </td>
                <td style={{ padding: '8px', wordWrap: 'break-word', textAlign: 'left', maxWidth: '150px' }}>{new Date(todo.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '8px', wordWrap: 'break-word', textAlign: 'left', maxWidth: '150px' }}>{todo.finished_date ? new Date(todo.finished_date).toLocaleDateString() : '-'}</td>
                <td style={{ padding: '8px', wordWrap: 'break-word', textAlign: 'left', maxWidth: '150px' }}>{todo.finished_date ? 'Sim' : 'Não'}</td>
                <td style={{ padding: '8px', wordWrap: 'break-word', textAlign: 'left', maxWidth: '150px' }}>
                  {todo.isEditing ? (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button onClick={() => saveEditedTask(todo.id)} style={{ padding: '.2em', cursor: 'pointer', border: '1px solid #35e12b' }} className="button-acoes">
                        Salvar
                      </button>
                      <button onClick={() => cancelEdit(todo.id)} style={{ padding: '.2em', cursor: 'pointer', border: '1px solid #df5b5b', marginLeft: '5px' }} className="button-acoes">
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div>
                      {!todo.finished_date &&
                        <button style={{ border: 'none' }} className="button-acoes" onClick={() => toggleComplete(todo.id)}>
                          <FontAwesomeIcon color="#35e12b" className="button-acoes-items" icon={faCheck} />
                        </button>
                      }

                      {todo.finished_date &&
                        <button style={{ border: 'none' }} className="button-acoes" onClick={() => toggleIncomplete(todo.id, todo.finished_date)}>
                          <FontAwesomeIcon color="#df5b5b" className="button-acoes-items" icon={faTimesCircle} />
                        </button>
                      }
                      <button style={{ border: 'none' }} className="button-acoes" onClick={() => editTodo(todo.id)}>
                        <FontAwesomeIcon color="#242424" className="button-acoes-items" icon={faEdit} />
                      </button>
                      <button style={{ border: 'none' }} className="button-acoes" onClick={() => deleteTodo(todo.id)}>
                        <FontAwesomeIcon color="#242424" className="button-acoes-items" icon={faTrashAlt} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {/* EXIBE NAO CONCLUIDOS */}
            {currentFilter === "notCompleted" && Array.isArray(todosNotCompleted) && todosNotCompleted.map((todosNotComplete) => (
              <tr key={todosNotComplete.id}>
                <td style={{ padding: '8px', wordWrap: 'break-word', textAlign: 'left', maxWidth: '150px' }}>
                  {todosNotComplete.isEditing ?
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ width: '100%', padding: '.4em', background: '#8758ff', border: 'none', borderRadius: '5px', color: '#fff' }}
                      placeholder="Edit name" />
                    :
                    todosNotComplete.name
                  }
                </td>
                <td style={{ padding: '8px', wordWrap: 'break-word', textAlign: 'left', maxWidth: '200px' }}>
                  {todosNotComplete.isEditing ?
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      style={{ width: '100%', padding: '.4em', background: '#8758ff', border: 'none', borderRadius: '5px', color: '#fff' }}
                      placeholder="Edit description"
                    />
                    :
                    todosNotComplete.description
                  }
                </td>
                <td style={{ padding: '8px', wordWrap: 'break-word', textAlign: 'left', maxWidth: '150px' }}>{new Date(todosNotComplete.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '8px', wordWrap: 'break-word', textAlign: 'left', maxWidth: '150px' }}>{todosNotComplete.finished_date ? new Date(todosNotComplete.finished_date).toLocaleDateString() : '-'}</td>
                <td style={{ padding: '8px', wordWrap: 'break-word', textAlign: 'left', maxWidth: '150px' }}>{todosNotComplete.finished_date ? 'Sim' : 'Não'}</td>
                <td style={{ padding: '8px', wordWrap: 'break-word', textAlign: 'left', maxWidth: '150px' }}>
                  {todosNotComplete.isEditing ? (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button onClick={() => saveEditedTask(todosNotComplete.id)} style={{ padding: '.2em', cursor: 'pointer', border: '1px solid #35e12b' }} className="button-acoes">
                        Salvar
                      </button>
                      <button onClick={() => cancelEdit(todosNotComplete.id)} style={{ padding: '.2em', cursor: 'pointer', border: '1px solid #df5b5b', marginLeft: '5px' }} className="button-acoes">
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div>
                      {!todosNotComplete.finished_date &&
                        <button style={{ border: 'none', borderRadius: '3px' }} className="button-acoes" onClick={() => toggleComplete(todosNotComplete.id)}>
                          <FontAwesomeIcon color="#35e12b" className="button-acoes-items" icon={faCheck} />
                        </button>
                      }

                      {todosNotComplete.finished_date &&
                        <button style={{ border: 'none' }} className="button-acoes" onClick={() => toggleIncomplete(todosNotComplete.id, todosNotComplete.finished_date)}>
                          <FontAwesomeIcon color="#df5b5b" className="button-acoes-items" icon={faTimesCircle} />
                        </button>
                      }
                      <button style={{ border: 'none' }} className="button-acoes" onClick={() => editTodo(todosNotComplete.id)}>
                        <FontAwesomeIcon color="#242424" className="button-acoes-items" icon={faEdit} />
                      </button>
                      <button style={{ border: 'none' }} className="button-acoes" onClick={() => deleteTodo(todosNotComplete.id)}>
                        <FontAwesomeIcon color="#242424" className="button-acoes-items" icon={faTrashAlt} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {/* EXIBE CONCLUIDOS */}
            {currentFilter === "completed" && Array.isArray(todosCompleted) && todosCompleted.map((todosComplete) => (
              <tr key={todosComplete.id}>
                <td style={{ padding: '8px', wordWrap: 'break-word', textAlign: 'left', maxWidth: '150px' }}>
                  {todosComplete.isEditing ?
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ width: '100%', padding: '.4em', background: '#8758ff', border: 'none', borderRadius: '5px', color: '#fff' }}
                      placeholder="Edit name" />
                    :
                    todosComplete.name
                  }
                </td>
                <td style={{ padding: '8px', wordWrap: 'break-word', textAlign: 'left', maxWidth: '200px' }}>
                  {todosComplete.isEditing ?
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      style={{ width: '100%', padding: '.4em', background: '#8758ff', border: 'none', borderRadius: '5px', color: '#fff' }}
                      placeholder="Edit description"
                    />
                    :
                    todosComplete.description
                  }
                </td>
                <td style={{ padding: '8px', wordWrap: 'break-word', textAlign: 'left', maxWidth: '150px' }}>{new Date(todosComplete.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '8px', wordWrap: 'break-word', textAlign: 'left', maxWidth: '150px' }}>{todosComplete.finished_date ? new Date(todosComplete.finished_date).toLocaleDateString() : '-'}</td>
                <td style={{ padding: '8px', wordWrap: 'break-word', textAlign: 'left', maxWidth: '150px' }}>{todosComplete.finished_date ? 'Sim' : 'Não'}</td>
                <td style={{ padding: '8px', wordWrap: 'break-word', textAlign: 'left', maxWidth: '150px' }}>
                  {todosComplete.isEditing ? (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button onClick={() => saveEditedTask(todosNotComplete.id)} style={{ padding: '.2em', cursor: 'pointer', border: '1px solid #35e12b' }} className="button-acoes">
                        Salvar
                      </button>
                      <button onClick={() => cancelEdit(todosNotComplete.id)} style={{ padding: '.2em', cursor: 'pointer', border: '1px solid #df5b5b', marginLeft: '5px' }} className="button-acoes">
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div>
                      {!todosComplete.finished_date &&
                        <button style={{ border: 'none' }} className="button-acoes" onClick={() => toggleComplete(todosComplete.id)}>
                          <FontAwesomeIcon color="#35e12b" className="button-acoes-items" icon={faCheck} />
                        </button>
                      }

                      {todosComplete.finished_date &&
                        <button style={{ border: 'none' }} className="button-acoes" onClick={() => toggleIncomplete(todosComplete.id, todosComplete.finished_date)}>
                          <FontAwesomeIcon color="#df5b5b" className="button-acoes-items" icon={faTimesCircle} />
                        </button>
                      }
                      <button style={{ border: 'none' }} className="button-acoes" onClick={() => editTodo(todosComplete.id)}>
                        <FontAwesomeIcon color="#242424" className="button-acoes-items" icon={faEdit} />
                      </button>
                      <button style={{ border: 'none' }} className="button-acoes" onClick={() => deleteTodo(todosComplete.id)}>
                        <FontAwesomeIcon color="#242424" className="button-acoes-items" icon={faTrashAlt} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {todos.length === 0 && (
        <div style={{ textAlign: 'center', color: '#fff', marginTop: '2em' }}>
          Não há tarefas a serem listadas!
        </div>
      )}
    </div>
  );
};

export default Home;
