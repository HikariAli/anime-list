$(document).ready(() => {
    const API_URL = 'http://localhost:3000';

    // Function to check if user is logged in
    const isLoggedIn = () => {
        const token = localStorage.getItem('token');
        return token ? true : false;
    };

    // Function to show registration form
    const showRegistrationForm = () => {
        $('#registrationForm').show();
        $('#loginForm').hide();
        $('#taskListContainer').hide();
    };

    // Function to show login form
    const showLoginForm = () => {
        $('#registrationForm').hide();
        $('#loginForm').show();
        $('#taskListContainer').hide();
    };

    // Function to show task list
    const showTaskList = async () => {
        $('#registrationForm').hide();
        $('#loginForm').hide();
        $('#taskListContainer').show();

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/tasks`, {
                headers: {
                    Authorization: `${token}`
                }
            });

            // console.log(response);

            if (response.ok) {
                const tasks = await response.json();
                $('#taskList').empty();
                tasks.forEach(task => {
                    $('#taskList').append(`
                        <li class="list-group-item">
                            <h5>${task.title}</h5>
                            <p>${task.description}</p>
                            <p><strong>Rating:</strong> ${task.rating}</p>
                            <button class="btn btn-danger delete-btn" data-id="${task._id}">Delete</button>
                            <button class="btn btn-primary edit-btn" data-id="${task._id}" data-title="${task.title}" data-description="${task.description}" data-rating="${task.rating}" data-toggle="modal" data-target="#editTaskModal">Edit</button>
                        </li>
                    `);
                });
            } else {
                const error = await response.json();
                alert('Error fetching tasks: ' + error.message);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Check if user is logged in and show appropriate view
    if (isLoggedIn()) {
        showTaskList();
        $('#logoutLink').show();
    } else {
        showLoginForm();
        $('#logoutLink').hide();
    }

    // Show registration form when "Register" link is clicked
    $('#registerLink').click(() => {
        showRegistrationForm();
    });

    // Show login form when "Login" link is clicked
    $('#loginLink').click(() => {
        showLoginForm();
    });

    // Handle user registration form submission
    $('#registerForm').submit(async (event) => {
        event.preventDefault();
        const username = $('#regUsername').val();
        const password = $('#regPassword').val();
        const email = $('#regEmail').val(); // Get email value

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, email }) // Send email to the server
            });
            
            if (response.ok) {
                showLoginForm();
                alert('Registration successful! Please login.');
            } else {
                const error = await response.json();
                alert('Error registering: ' + error.message);
            }
        } catch (error) {
            console.error('Error registering:', error);
        }
    });

    // Handle user login form submission
    $('#loginForm').submit(async (event) => {
        event.preventDefault();
        const username = $('#loginUsername').val();
        const password = $('#loginPassword').val();

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;
                localStorage.setItem('token', token);
                showTaskList();
                $('#logoutLink').show();
            } else {
                const error = await response.json();
                alert('Error logging in: ' + error.message);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    });

    // Handle user logout
    $('#logoutLink').click(() => {
        localStorage.removeItem('token');
        showLoginForm();
        $('#logoutLink').hide();
    });

    // Handle task deletion
    $('#taskList').on('click', '.delete-btn', async function () {
        const taskId = $(this).data('id');
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/tasks/${taskId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `${token}`
                    }
                });

                if (response.ok) {
                    showTaskList();
                } else {
                    const error = await response.json();
                    alert('Error deleting task: ' + error.message);
                }
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    });

    // Handle task editing
    $('#taskList').on('click', '.edit-btn', function () {
        const taskId = $(this).data('id');
        const title = $(this).data('title');
        const description = $(this).data('description');
        const rating = $(this).data('rating');

        $('#editTitle').val(title);
        $('#editDescription').val(description);
        $('#editRating').val(rating);
        $('#editTaskModal').data('task-id', taskId);
    });

    // Handle edit task form submission
    $('#editTaskForm').submit(async (event) => {
        event.preventDefault();
        const taskId = $('#editTaskModal').data('task-id');
        const title = $('#editTitle').val();
        const description = $('#editDescription').val();
        const rating = $('#editRating').val();

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`
                },
                body: JSON.stringify({ title, description, rating })
            });

            if (response.ok) {
                $('#editTaskModal').modal('hide');
                showTaskList();
            } else {
                const error = await response.json();
                alert('Error updating task: ' + error.message);
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    });

    // Handle add task form submission
    $('#taskForm').submit(async (event) => {
        event.preventDefault();
        const title = $('#title').val();
        const description = $('#description').val();
        const rating = $('#rating').val();

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`
                },
                body: JSON.stringify({ title, description, rating })
            });

            if (response.ok) {
                $('#title').val('');
                $('#description').val('');
                $('#rating').val('');
                showTaskList();
            } else {
                const error = await response.json();
                alert('Error adding task: ' + error.message);
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    });
});

function displayAnimeNews(newsItems) {
    var carouselIndicators = '';
    var newsHtml = '';
    newsItems.forEach(function(newsItem, index) {
        // Determine active class for the first item
        var activeClass = index === 0 ? 'active' : '';

        // Carousel Indicators
        carouselIndicators += `
            <li data-target="#newsCarousel" data-slide-to="${index}" class="${activeClass}"></li>
        `;

        // Carousel Inner (News Items)
        newsHtml += `
            <div class="carousel-item ${activeClass}">
                <img src="${newsItem.images.jpg.image_url}" class="d-block" alt="${newsItem.title}">
                <div class="carousel-caption d-none d-md-block">
                    <h5>${newsItem.title}</h5>
                    <p>${newsItem.excerpt}</p>
                    <a href="${newsItem.url}" class="btn btn-primary" target="_blank">Read More</a>
                </div>
            </div>
        `;
    });

    // Update Carousel Indicators and Inner HTML
    document.getElementById('newsCarousel').querySelector('.carousel-indicators').innerHTML = carouselIndicators;
    document.getElementById('newsCarousel').querySelector('.carousel-inner').innerHTML = newsHtml;
}

// Fetch anime news from the server-side route using plain JavaScript fetch
document.addEventListener('DOMContentLoaded', function() {
    fetch('/news/anime-news')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Error fetching anime news.');
            }
            return response.json();
        })
        .then(function(newsItems) {
            displayAnimeNews(newsItems);
        })
        .catch(function(error) {
            console.error(error);
        });
});