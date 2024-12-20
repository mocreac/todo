document.addEventListener('DOMContentLoaded', () => {
    const addNewModal: HTMLElement = document.querySelector('#addNewModal')!;
    const addButtons = document.querySelectorAll('[data-modal-target="addNewModal"]');
    const closeModalButton = document.querySelector('#closeModalButton')!;
    const modalOverlay = document.querySelector('#modalOverlay')!;
    const addTaskButton = document.getElementById('addTaskButton')!;
    const taskForm = document.getElementById('addTaskForm') as HTMLFormElement;
    let currentColumnBody: HTMLElement | null = null;
    const taskCompletedSound = new Audio('/public/sound/reward.mp3');

    // Function to update the header with the current week range
    function updateHeaderWithCurrentWeek() {
        const now = new Date();
        const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
        const lastDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 7));
        const month = firstDayOfWeek.toLocaleString('default', { month: 'long' });
        const year = firstDayOfWeek.getFullYear();
        const weekRange = `${firstDayOfWeek.getDate()} - ${lastDayOfWeek.getDate()}`;

        document.getElementById('month')!.textContent = month;
        document.getElementById('year')!.textContent = year.toString();
        document.getElementById('week-range')!.textContent = weekRange;

        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        days.forEach((day, index) => {
            const date = new Date(firstDayOfWeek);
            date.setDate(firstDayOfWeek.getDate() + index);
            const dayElement = document.getElementById(`${day}-date`)!;
            dayElement.textContent = date.getDate().toString();
            if (date.toDateString() === new Date().toDateString()) {
                dayElement.classList.add('bg-yellow-400', 'rounded-md', 'px-2','text-black');
            }
        });
    }

    updateHeaderWithCurrentWeek();

    // Function to save tasks to localStorage
    function saveTasks() {
        const tasks = Array.from(document.querySelectorAll('.task-element')).map(task => ({
            title: task.querySelector('h3')!.textContent,
            color: task.querySelector('div')!.classList[1].split('-')[1],
            completed: task.classList.contains('completed'),
            column: task.closest('.cbody')!.querySelector('h4')!.textContent
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.forEach((task: any) => {
            const column = Array.from(document.querySelectorAll('.cbody')).find(col => col.querySelector('h4')!.textContent === task.column);
            if (column) {
                const taskElement = document.createElement('div');
                taskElement.className = `task-element bg-bgCard border-[1px] border-bgStroke rounded-md flex flex-col p-3 gap-3 shadow-lg cursor-pointer ${task.completed ? 'completed' : ''}`;
                taskElement.innerHTML = `
                    <div class="flex gap-2 h-full">
                        <div class="h-full w-[3px] bg-${task.color}-500 rounded-full"></div>
                        <h3 class="text-sm text-white ${task.completed ? 'line-through' : ''}">${task.title}</h3>
                    </div>
                    <div class="lwr-task-section flex-col gap-3 hidden">
                        <div class="h-[2px] w-full bg-bgStroke"></div>
                        <div class="flex gap-4 md:gap-2">
                            ${task.completed ? '' : '<button class="complete-task bg-[#3D3D3D] h-8 w-8 rounded-sm hover:bg-[#494949] duration-200 flex items-center justify-center"><i class="ph ph-check text-lg"></i></button>'}
                            <button class="delete-task bg-[#3D3D3D] h-8 w-8 rounded-sm hover:bg-[#494949] duration-200 flex items-center justify-center"><i class="ph ph-trash text-lg"></i></button>
                        </div>
                    </div>
                `;
                column.insertBefore(taskElement, column.querySelector('.add-new-button'));

                taskElement.addEventListener('click', () => {
                    taskElement.classList.toggle('expanded');
                    const lowerSection = taskElement.querySelector('.lwr-task-section');
                    if (lowerSection) {
                        lowerSection.classList.toggle('hidden');
                    }
                });

                if (!task.completed) {
                    taskElement.querySelector('.complete-task')!.addEventListener('click', (e) => {
                        e.stopPropagation();
                        taskElement.classList.add('completed', 'bg-bgDark');
                        taskElement.querySelector('h3')!.classList.add('line-through');
                        taskElement.querySelector('.complete-task')!.remove();
                        taskCompletedSound.play();
                        saveTasks();
                    });
                }

                taskElement.querySelector('.delete-task')!.addEventListener('click', (e) => {
                    e.stopPropagation();
                    taskElement.remove();
                    saveTasks();
                });
            }
        });
    }

    loadTasks();

    addButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            addNewModal.classList.remove('hidden');
            modalOverlay.classList.remove('hidden');
            currentColumnBody = (event.currentTarget as HTMLElement).closest('.cbody');
        });
    });

    closeModalButton.addEventListener('click', () => {
        addNewModal.classList.add('hidden');
        modalOverlay.classList.add('hidden');
    });

    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            addNewModal.classList.add('hidden');
            modalOverlay.classList.add('hidden');
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            addNewModal.classList.add('hidden');
            modalOverlay.classList.add('hidden');
        }
    });

    function addTask(event: Event) {
        event.preventDefault();
        const formData = new FormData(taskForm);
        const title = formData.get('taskTitle') as string;
        const color = formData.get('colors') as string || 'red'; // Default color is red

        if (title && currentColumnBody) {
            const taskElement = document.createElement('div');
            taskElement.className = `task-element bg-bgCard border-[1px] border-bgStroke rounded-md flex flex-col p-3 gap-3 shadow-lg cursor-pointer`;
            taskElement.innerHTML = `
                <div class="flex gap-2 h-full">
                    <div class="h-full w-[3px] bg-${color}-500 rounded-full"></div>
                    <h3 class="text-sm text-white">${title}</h3>
                </div>
                <div class="lwr-task-section flex-col gap-3 hidden">
                    <div class="h-[2px] w-full bg-bgStroke"></div>
                    <div class="flex gap-4 md:gap-2">
                        <button class="complete-task bg-[#3D3D3D] h-8 w-8 rounded-sm hover:bg-[#494949] duration-200 flex items-center justify-center"><i class="ph ph-check text-lg"></i></button>
                        <button class="delete-task bg-[#3D3D3D] h-8 w-8 rounded-sm hover:bg-[#494949] duration-200 flex items-center justify-center"><i class="ph ph-trash text-lg"></i></button>
                    </div>
                </div>
            `;
            currentColumnBody.insertBefore(taskElement, currentColumnBody.querySelector('.add-new-button'));

            taskForm.reset();
            addNewModal.classList.add('hidden');
            modalOverlay.classList.add('hidden');

            taskElement.addEventListener('click', () => {
                taskElement.classList.toggle('expanded');
                const lowerSection = taskElement.querySelector('.lwr-task-section');
                if (lowerSection) {
                    lowerSection.classList.toggle('hidden');
                }
            });

            taskElement.querySelector('.complete-task')!.addEventListener('click', (e) => {
                e.stopPropagation();
                taskElement.classList.add('completed', 'bg-bgDark');
                taskElement.querySelector('h3')!.classList.add('line-through');
                taskElement.querySelector('.complete-task')!.remove();
                taskCompletedSound.play();
                saveTasks();
            });

            taskElement.querySelector('.delete-task')!.addEventListener('click', (e) => {
                e.stopPropagation();
                taskElement.remove();
                saveTasks();
            });

            saveTasks();
        }
    }

    addTaskButton.addEventListener('click', addTask);

    taskForm.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addTask(event);
        }
    });

    document.querySelectorAll('.task-element').forEach(task => {
        task.addEventListener('click', () => {
            task.classList.toggle('expanded');
            const lowerSection = task.querySelector('.lwr-task-section');
            if (lowerSection) {
                lowerSection.classList.toggle('hidden');
            }
        });
    });
});