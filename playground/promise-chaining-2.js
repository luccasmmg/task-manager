require('../src/db/mongoose.js');
const Task = require('../src/models/task');

const deleteTaskAndCount = async (id, taskStatus) => {
    const task = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({ completed: taskStatus });
    return count;
};

deleteTaskAndCount('5d0e61fb19bb7053474802e8').then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e);
});
