import React from 'react';

function TodoList() {
  const todos = [
    { subject: 'Math Homework', due: '2025-05-03' },
    { subject: 'Science Project', due: '2025-05-06' },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">To-Do List</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600">
            <th>Subject</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo, i) => (
            <tr key={i} className="border-t">
              <td className="py-2">{todo.subject}</td>
              <td className="py-2">{todo.due}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TodoList;
