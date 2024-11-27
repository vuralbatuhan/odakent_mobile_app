export const fetchUserType = async username => {
  try {
    const response = await fetch(`http://192.168.1.36:5000/users/${username}`);
    if (!response.ok) {
      throw new Error('Hata oluştu: ' + response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hata oluştu:', error);
    throw error;
  }
};

export const fetchRooms = async () => {
  try {
    const response = await fetch('http://192.168.1.36:5000/rooms');
    const data = await response.json();

    const formattedData = data.map(item => ({
      label: item.room,
      value: item.id,
    }));

    return [{label: 'Hepsi', value: 'all'}, ...formattedData];
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
};

export const fetchProblems = async () => {
  try {
    const response = await fetch('http://192.168.1.36:5000/problems');
    const data = await response.json();

    const formattedData = data.map(item => ({
      label: item.problem,
      value: item.id,
    }));

    return [{label: 'Hepsi', value: 'all'}, ...formattedData];
  } catch (error) {
    console.error('Error fetching problems:', error);
    return [];
  }
};

export const fetchItems = async (room_id, problem) => {
  try {
    const response = await fetch(
      `http://192.168.1.36:5000/tasks/${room_id}/${problem}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hata oluştu:', error);
  }
};

export const fetchAllItems = async () => {
  try {
    const response = await fetch(`http://192.168.1.36:5000/tasks`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
};

export const fetchAllRoomItems = async room_id => {
  try {
    const url = `http://192.168.1.36:5000/tasks/${room_id}`;

    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
};

export const fetchAllProblemItems = async problem => {
  try {
    const response = await fetch(
      `http://192.168.1.36:5000/tasks/admin/${problem}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching items for problem:', error);
    return [];
  }
};

export const addItem = async (
  title,
  text,
  selectedProblem,
  imageUri,
  selectedRoom,
  selectedRoom_id,
) => {
  if (text) {
    try {
      const response = await fetch('http://192.168.1.36:5000/tasks', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          title: title,
          description: text,
          problem: selectedProblem,
          image: imageUri,
          room: selectedRoom,
          room_id: selectedRoom_id,
        }),
      });

      if (response.ok) {
        await fetchAllItems();
      } else {
        alert('Error adding item.');
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  }
};
