export const fetchMessages = async (room, id) => {
  if (!room) throw new Error('Room bilgisi eksik.');

  try {
    const response = await fetch(
      `http://192.168.1.124:5000/messages/${room}/${id}`,
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
      'http://192.168.1.124:5000/tasks/update/statu',
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
    const response = await fetch(`http://192.168.1.124:5000/tasks/${id}`, {
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
