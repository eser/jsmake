// TODO check
var task = jsmake.createTask('default');

task.setDescription('Says hello.');
task.setAction(function (argv) { console.log('hi there'); });

jsmake.task(task);
