$(document).ready(function() {
    
    // Quiz Questions Database
    const quizQuestions = [
        {
            question: "What does HTML stand for?",
            options: [
                "Hyper Text Markup Language",
                "High Tech Modern Language",
                "Home Tool Markup Language",
                "Hyperlinks and Text Markup Language"
            ],
            correct: 0
        },
        {
            question: "Which CSS property is used to change the text color of an element?",
            options: [
                "text-color",
                "font-color",
                "color",
                "text-style"
            ],
            correct: 2
        },
        {
            question: "What does CSS stand for?",
            options: [
                "Colorful Style Sheets",
                "Cascading Style Sheets",
                "Computer Style Sheets",
                "Creative Style Sheets"
            ],
            correct: 1
        },
        {
            question: "Which method is used to select an element by ID in jQuery?",
            options: [
                "$('.id')",
                "$('#id')",
                "$('id')",
                "$.id()"
            ],
            correct: 1
        },
        {
            question: "What is the correct HTML element for inserting a line break?",
            options: [
                "break",
                "lb",
                "br",
                "newline"
            ],
            correct: 2
        },
        {
            question: "Which symbol is used for comments in JavaScript?",
            options: [
                "!-- --",
                "/* */",
                "//",
                "Both // and /* */"
            ],
            correct: 3
        },
        {
            question: "Which jQuery method is used to hide selected elements?",
            options: [
                "hidden()",
                "hide()",
                "display()",
                "invisible()"
            ],
            correct: 1
        },
        {
            question: "What is the correct syntax for referring to an external CSS file?",
            options: [
                "style src='style.css'",
                "stylesheet>style.css</stylesheet",
                "link rel='stylesheet' href='style.css'",
                "css>style.css</css"
            ],
            correct: 2
        },
        {
            question: "Which HTML attribute is used to define inline styles?",
            options: [
                "class",
                "style",
                "styles",
                "font"
            ],
            correct: 1
        },
        {
            question: "What does DOM stand for?",
            options: [
                "Document Object Model",
                "Display Object Management",
                "Digital Orientation Model",
                "Document Oriented Mechanism"
            ],
            correct: 0
        }
    ];

    // Quiz State Variables
    let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers = [];
    let totalQuestions = quizQuestions.length;

    // Initialize Quiz
    function initQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];
        $('#totalQuestions').text(totalQuestions);
        $('#totalQuestionsDisplay').text(totalQuestions);
    }

    // Start Quiz Button
    $('#startBtn').on('click', function() {
        $(this).prop('disabled', true).text('Loading...');
        
        // Fade out welcome screen with animation
        $('#welcomeScreen').fadeOut(500, function() {
            $('#quizScreen').fadeIn(500).addClass('active');
            loadQuestion(currentQuestionIndex);
            updateProgress();
            $(this).prop('disabled', false).text('Start Quiz');
        });
    });

    // Load Question Function
    function loadQuestion(index) {
        const question = quizQuestions[index];
        
        // Fade out current content
        $('.question-container, .options-container').fadeOut(300, function() {
            // Update question text
            $('#questionText').text(question.question);
            
            // Clear and load options
            $('#optionsContainer').empty();
            
            question.options.forEach(function(option, i) {
                const optionHTML = `
                    <div class="option" data-index="${i}">
                        <input type="radio" id="option${i}" name="answer" value="${i}">
                        <label for="option${i}">${option}</label>
                    </div>
                `;
                $('#optionsContainer').append(optionHTML);
            });

            // Check if user has previously selected an answer for this question
            if (userAnswers[index] !== undefined) {
                $(`input[value="${userAnswers[index]}"]`).prop('checked', true);
                $(`.option[data-index="${userAnswers[index]}"]`).addClass('selected');
            }

            // Fade in new content
            $('.question-container, .options-container').fadeIn(300);
            
            // Update question counter
            $('#currentQuestion').text(index + 1);
            
            // Hide validation message
            $('#validationMessage').removeClass('show error');
        });
    }

    // Option Selection with Event Delegation
    $('#optionsContainer').on('click', '.option', function() {
        // Remove selected class from all options
        $('.option').removeClass('selected');
        
        // Add selected class to clicked option
        $(this).addClass('selected');
        
        // Check the radio button
        $(this).find('input[type="radio"]').prop('checked', true);
        
        // Hide validation message when option is selected
        $('#validationMessage').removeClass('show error');
    });

    // Radio button change event
    $('#optionsContainer').on('change', 'input[type="radio"]', function() {
        $('.option').removeClass('selected');
        $(this).closest('.option').addClass('selected');
    });

    // Validate Answer Selection
    function validateAnswer() {
        const selectedAnswer = $('input[name="answer"]:checked');
        
        if (selectedAnswer.length === 0) {
            // Show validation message with animation
            $('#validationMessage')
                .text('Please select an answer before proceeding!')
                .addClass('show error');
            return false;
        }
        return true;
    }

    // Next Button Click
    $('#nextBtn').on('click', function() {
        if (!validateAnswer()) {
            return;
        }

        // Save user answer
        const selectedAnswer = parseInt($('input[name="answer"]:checked').val());
        userAnswers[currentQuestionIndex] = selectedAnswer;

        // Check if answer is correct
        if (selectedAnswer === quizQuestions[currentQuestionIndex].correct) {
            score++;
            $('#currentScore').text(score).parent().fadeOut(100).fadeIn(100);
        }

        // Move to next question
        currentQuestionIndex++;

        if (currentQuestionIndex < totalQuestions) {
            loadQuestion(currentQuestionIndex);
            updateProgress();
            updateNavigationButtons();
        } else {
            // Last question - show submit button
            $('#nextBtn').hide();
            $('#submitBtn').fadeIn(300);
        }
    });

    // Previous Button Click
    $('#prevBtn').on('click', function() {
        if (currentQuestionIndex > 0) {
            // Save current answer if selected
            const selectedAnswer = $('input[name="answer"]:checked').val();
            if (selectedAnswer !== undefined) {
                userAnswers[currentQuestionIndex] = parseInt(selectedAnswer);
            }

            currentQuestionIndex--;
            loadQuestion(currentQuestionIndex);
            updateProgress();
            updateNavigationButtons();
            
            // Show next button, hide submit button
            $('#nextBtn').show();
            $('#submitBtn').hide();
        }
    });

    // Update Navigation Buttons
    function updateNavigationButtons() {
        // Enable/disable previous button
        if (currentQuestionIndex === 0) {
            $('#prevBtn').prop('disabled', true);
        } else {
            $('#prevBtn').prop('disabled', false);
        }

        // Show/hide next and submit buttons
        if (currentQuestionIndex === totalQuestions - 1) {
            $('#nextBtn').hide();
            $('#submitBtn').show();
        } else {
            $('#nextBtn').show();
            $('#submitBtn').hide();
        }
    }

    // Update Progress Bar
    function updateProgress() {
        const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
        $('#progressFill').css('width', progress + '%');
    }

    // Submit Quiz
    $('#submitBtn').on('click', function() {
        if (!validateAnswer()) {
            return;
        }

        // Save last answer
        const selectedAnswer = parseInt($('input[name="answer"]:checked').val());
        userAnswers[currentQuestionIndex] = selectedAnswer;

        // Check last answer
        if (selectedAnswer === quizQuestions[currentQuestionIndex].correct) {
            score++;
        }

        // Show results
        showResults();
    });

    // Show Results Screen
    function showResults() {
        const percentage = ((score / totalQuestions) * 100).toFixed(1);
        const wrongAnswers = totalQuestions - score;

        // Update result values
        $('#resultTotal').text(totalQuestions);
        $('#resultCorrect').text(score);
        $('#resultWrong').text(wrongAnswers);
        $('#resultScore').text(percentage + '%');

        // Set result emoji and message based on score
        let emoji, message;
        if (percentage >= 80) {
            emoji = '🎉';
            message = 'Excellent! You did a fantastic job!';
        } else if (percentage >= 60) {
            emoji = '👍';
            message = 'Good work! Keep practicing!';
        } else if (percentage >= 40) {
            emoji = '📚';
            message = 'Not bad! There\'s room for improvement!';
        } else {
            emoji = '💪';
            message = 'Keep learning! Practice makes perfect!';
        }

        $('#resultEmoji').text(emoji);
        $('#resultMessage').text(message);

        // Animate transition to result screen
        $('#quizScreen').fadeOut(500, function() {
            $('#resultScreen').fadeIn(500).addClass('active');
        });
    }

    // Restart Quiz
    $('#restartBtn, #restartFromReviewBtn').on('click', function() {
        // Reset quiz
        initQuiz();
        
        // Hide current screen and show welcome screen
        $('.screen').fadeOut(500, function() {
            $(this).removeClass('active');
        });
        
        setTimeout(function() {
            $('#welcomeScreen').fadeIn(500).addClass('active');
        }, 500);

        // Reset navigation buttons
        $('#prevBtn').prop('disabled', true);
        $('#nextBtn').show();
        $('#submitBtn').hide();
        $('#currentScore').text('0');
    });

    // Review Answers Button
    $('#reviewBtn').on('click', function() {
        showReview();
        $('#resultScreen').fadeOut(500, function() {
            $('#reviewScreen').fadeIn(500).addClass('active');
        });
    });

    // Show Review Screen
    function showReview() {
        $('#reviewContainer').empty();

        quizQuestions.forEach(function(question, index) {
            const userAnswer = userAnswers[index];
            const correctAnswer = question.correct;
            const isCorrect = userAnswer === correctAnswer;

            const reviewHTML = `
                <div class="review-item">
                    <div class="review-question">
                        <strong>Question ${index + 1}:</strong> ${question.question}
                    </div>
                    <div class="review-answer user-answer ${isCorrect ? 'correct-user' : ''}">
                        <span class="answer-label">Your Answer:</span>
                        ${question.options[userAnswer]} ${isCorrect ? '✓' : '✗'}
                    </div>
                    ${!isCorrect ? `
                        <div class="review-answer correct-answer">
                            <span class="answer-label">Correct Answer:</span>
                            ${question.options[correctAnswer]} ✓
                        </div>
                    ` : ''}
                </div>
            `;

            $('#reviewContainer').append(reviewHTML);
        });

        // Animate review items
        $('.review-item').each(function(index) {
            $(this).hide().delay(index * 100).fadeIn(300);
        });
    }

    // Back to Result Button
    $('#backToResultBtn').on('click', function() {
        $('#reviewScreen').fadeOut(500, function() {
            $('#resultScreen').fadeIn(500).addClass('active');
        });
    });

    // Initialize quiz on page load
    initQuiz();

    // Add hover effect to buttons using jQuery
    $('.btn').hover(
        function() {
            if (!$(this).prop('disabled')) {
                $(this).css('transform', 'translateY(-2px)');
            }
        },
        function() {
            if (!$(this).prop('disabled')) {
                $(this).css('transform', 'translateY(0)');
            }
        }
    );

    // Add click animation to options
    $('#optionsContainer').on('mousedown', '.option', function() {
        $(this).css('transform', 'scale(0.98)');
    }).on('mouseup mouseleave', '.option', function() {
        $(this).css('transform', 'scale(1)');
    });

    // Keyboard navigation
    $(document).on('keydown', function(e) {
        // Only enable keyboard navigation on quiz screen
        if ($('#quizScreen').hasClass('active')) {
            // Arrow keys to select options (1-4)
            if (e.keyCode >= 49 && e.keyCode <= 52) {
                const optionIndex = e.keyCode - 49;
                const option = $(`.option[data-index="${optionIndex}"]`);
                if (option.length) {
                    option.click();
                }
            }
            // Enter key to go to next question
            else if (e.keyCode === 13) {
                if ($('#submitBtn').is(':visible')) {
                    $('#submitBtn').click();
                } else if (!$('#nextBtn').prop('disabled')) {
                    $('#nextBtn').click();
                }
            }
            // Backspace to go to previous question
            else if (e.keyCode === 8 && !$('#prevBtn').prop('disabled')) {
                e.preventDefault();
                $('#prevBtn').click();
            }
        }
    });

    // Console log for debugging
    console.log('Quiz Application Initialized');
    console.log('Total Questions:', totalQuestions);
    console.log('jQuery Version:', $.fn.jquery);
});