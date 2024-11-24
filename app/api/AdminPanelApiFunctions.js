export const createRoom = async room => {
  try {
    const response = await fetch('http://192.168.1.124:5000/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({room}),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || 'Şirket oluşturulurken bir hata oluştu.',
      );
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const createProblem = async problem => {
  try {
    const response = await fetch('http://192.168.1.124:5000/problems', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({problem}),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || 'Problem oluşturulurken bir hata oluştu.',
      );
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const createStatu = async statu => {
  try {
    const response = await fetch('http://192.168.1.124:5000/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({statu}),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || 'Statu oluşturulurken bir hata oluştu.',
      );
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (username, password, room, user_type) => {
  try {
    const response = await fetch('http://192.168.1.124:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, password, room, user_type}),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || 'Kullanıcı oluşturulurken bir hata oluştu.',
      );
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const fetchRooms = async () => {
  try {
    const response = await fetch('http://192.168.1.124:5000/rooms');
    const data = await response.json();

    const formattedData = data.map(item => ({
      label: item.room,
      value: item.room,
    }));

    return formattedData;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
};

export const fetchProblems = async () => {
  try {
    const response = await fetch('http://192.168.1.124:5000/problems');
    const data = await response.json();

    const formattedData = data.map(item => ({
      label: item.problem,
      value: item.problem,
    }));

    return formattedData;
  } catch (error) {
    console.error('Error fetching problems:', error);
    return [];
  }
};

export const fetchStatus = async () => {
  try {
    const response = await fetch('http://192.168.1.124:5000/status');
    const data = await response.json();

    const formattedData = data.map(item => ({
      label: item.statu,
      value: item.statu,
    }));

    return formattedData;
  } catch (error) {
    console.error('Error fetching status:', error);
    return [];
  }
};
