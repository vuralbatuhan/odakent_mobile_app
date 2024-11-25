export const fetchProblems = async () => {
  try {
    const response = await fetch('http://192.168.1.36:5000/problems');
    const data = await response.json();
    const formattedData = data.map(item => ({
      label: item.problem,
      value: item.problem,
    }));

    return [{label: 'Hepsi', value: 'all'}, ...formattedData];
  } catch (error) {
    console.error('Error fetching problems:', error);
    return [];
  }
};

export const fetchItems = async (problem, roomGroupName) => {
  try {
    const response = await fetch(
      `http://192.168.1.36:5000/tasks/${problem}/${roomGroupName}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
};

export const fetchAllItems = async roomGroupName => {
  try {
    const response = await fetch(
      `http://192.168.1.36:5000/tasks/${roomGroupName}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
};

export const fetchRoomGroupName = async username => {
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

export const addItem = async (
  title,
  text,
  selectedProblem,
  imageUri,
  roomGroupName,
) => {
  try {
    const response = await fetch('http://192.168.1.36:5000/tasks', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        title,
        description: text,
        problem: selectedProblem,
        image: imageUri,
        room: roomGroupName,
      }),
    });

    if (!response.ok) {
      throw new Error('Error adding item.');
    }
    return true;
  } catch (error) {
    console.error('Error adding item:', error);
    return false;
  }
};
