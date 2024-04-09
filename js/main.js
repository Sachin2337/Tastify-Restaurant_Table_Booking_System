(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });
    
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav : false,
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
})(jQuery);


fetch('http://localhost:3000/api/menuItems')
.then(response => response.json())
    .then(menuItems => {
        // Get the container element
        const container = document.getElementById('menuItemsContainer');

        // Iterate over each menu item
        menuItems.forEach(item => {
            // Create HTML elements for the item
            const itemElement = document.createElement('div');
            itemElement.classList.add('col-lg-6');
            itemElement.innerHTML = `
                    <div class="d-flex align-items-center">
                        <img class="flex-shrink-0 img-fluid rounded" src="http://localhost:3000/${item.image}" alt="" style="width: 80px;">
                        <div class="w-100 d-flex flex-column text-start ps-4">
                            <h5 class="d-flex justify-content-between border-bottom pb-2">
                                <span>${item.name}</span>
                                <span class="text-primary">Rs ${item.price}</span>
                            </h5>
                            <small class="fst-italic">${item.description}</small>
                        </div>
                    </div>
                `;
            menuItemsContainer.appendChild(itemElement);
        });
    })
    .catch(error => {
        console.error('Error fetching menu items:', error);
    });


    reservation.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(reservation);
    for (const [key, value] of formData) {
        console.log(key,value);
      }
    let data = {};
    formData.forEach((value, key) => data[key] = value);

    fetch('http://localhost:3000/api/reserve',{
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body:JSON.stringify(data)
    })
    .then((res) => {console.log(res.json());}).
    then(() => reservation.reset());
});


feedback.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(feedback);
    for (const [key, value] of formData) {
        console.log(key,value);
      }
    
    let data ={}
    formData.forEach((value, key) => data[key] = value);

    fetch('http://localhost:3000/api/feedback',{
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body:JSON.stringify(data)
    })
    .then((res) => {console.log(res.json());}).
    then(() => feedback.reset());
    window.location.reload();
})


async function fetchFeedback() {
    try {
        const response = await fetch('http://localhost:3000/api/feedback'); // Adjust the API endpoint accordingly
        if (!response.ok) {
            throw new Error('Failed to fetch feedback');
        }
        const feedbackData = await response.json();
        return feedbackData;
    } catch (error) {
        console.error('Error fetching feedback:', error);
        return null;
    }
}

// Function to populate testimonial items
const populateTestimonials=async()=> {
    const feedbackData = await fetchFeedback('http://localhost:3000/api/feedback');
    const testimonialContainer = document.getElementById('testimonialContainer');
    if (feedbackData && feedbackData.length > 0) {
        feedbackData.forEach(feedback => {
            // Create testimonial item
            const testimonialItem = document.createElement('div');
            testimonialItem.classList.add('testimonial-item', 'bg-transparent', 'border', 'rounded', 'p-4','ml-5','mr-5','mb-2' );
            testimonialItem.innerHTML = `
                <i class="fa fa-quote-left fa-2x text-primary mb-3"></i>
                        <p>${feedback.Comments}</p>
                        <div class="d-flex align-items-center">
                            
                            <div class="ps-3">
                                <h5 class="mb-1">${feedback.UserName}</h5>
                            </div>
                        </div>
            `;
            // Append testimonial item to container
            testimonialContainer.appendChild(testimonialItem);
        });
    } else {
        // Display message if no feedback is available
        testimonialContainer.innerHTML = '<p>No feedback available</p>';
    }
}

// Call the function to populate testimonials when the page loads
window.onload = populateTestimonials();