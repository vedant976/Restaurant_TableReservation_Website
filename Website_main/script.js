
$(document).ready(function() {
  
    $('button').on('click', function() {
      if($(this).hasClass('nav-button')) {
        $('nav div').addClass('show');
      } else if($(this).hasClass('exit-menu')) {
        $('nav div').removeClass('show');
      } 
      else if($(this).hasClass('to-top')) {
        $('html,body').animate({scrollTop:0}, 'slow');
      }
    });
  
    AOS.init({      
          duration: 1800,
      easing: 'ease'
    });
     
  })

  document.addEventListener("DOMContentLoaded", function () {
  
    const currentUrl = window.location.pathname;
    const pageName = currentUrl.split("/").pop().replace(".html", "").toLowerCase();

    
    const navLinks = {
        "restaurant": "home-link",
        "menu": "menu-link",
        "reservations": "reservations-link",
        "news": "news-link",
        "contact": "contact-link",
        "aboutus": "aboutus-link",
        "managereservation": "manage-reservation-link"
    };

    if (navLinks[pageName]) {
        document.getElementById(navLinks[pageName]).classList.add("active");
    }
});

