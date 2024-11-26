export const fetchMessages = async (room_id, id) => {
  if (!room_id) throw new Error('Room bilgisi eksik.');

  try {
    const response = await fetch(
      `http://192.168.1.36:5000/messages/${room_id}/${id}`,
    );
    if (!response.ok) {
      throw new Error('Mesajlar alınırken hata oluştu: ' + response.statusText);
    }
    return await response.json();
  } catch (error) {
    console.error('Mesajlar alınırken hata oluştu:', error);
    throw error;
  }
};

export const updateProblem = async (id, statu_id) => {
  try {
    const response = await fetch(
      'http://192.168.1.36:5000/tasks/update/statu',
      {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id, statu_id}),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Güncelleme sırasında hata oluştu.');
    }
    return result.updatedTask;
  } catch (error) {
    console.error('Görev güncellenirken hata oluştu:', error);
    throw error;
  }
};

export const deleteTask = async id => {
  try {
    const response = await fetch(`http://192.168.1.36:5000/tasks/${id}`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
    });

    if (!response.ok) {
      throw new Error('Silme işlemi başarısız.');
    }
    return true;
  } catch (error) {
    console.error('Görev silinirken hata oluştu:', error);
    throw error;
  }
};

export const fetchTaskDetails = async (problem_id, room_id, id) => {
  try {
    const response = await fetch(
      `http://your-backend-url/tasks/${problem_id}/${room_id}/${id}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Veri alınırken hata oluştu:', error);
    throw error;
  }
};
