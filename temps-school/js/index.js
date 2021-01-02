



function shownav(){
    if(document.getElementById("MyId").className == "hide"){
       document.getElementById("MyId").className = "show";
       document.getElementById("mobile-bars").className = " fa fa-close";

    }
    else{
       document.getElementById("MyId").className = "hide";
       document.getElementById("mobile-bars").className = " fa fa-bars";
    }
    }


    function showDrop(){
   //   if(  document.getElementById("drop-menu").style.display=="none"){
      document.getElementById("drop-menu").style.display="block";
   // }
   // else{
   //    document.getElementById("drop-menu").style.display="none";
   //   }
    }

    function hideDrop(){
      // if(  document.getElementById("drop-menu").style.display=="block"){
       document.getElementById("drop-menu").style.display="none"; 
   //   }
   }


   function navinshow(){
   //    if(  document.getElementById("nav-in-list").style.display=="none"){
   //     document.getElementById("nav-in-list").style.display="block"; 
   //    }
   //    else{
   //       document.getElementById("nav-in-list").style.display="none"; 
   //   }

     if(  document.getElementById("nav-in-list").style.display=="block"){
      document.getElementById("nav-in-list").style.display="none"; 
     }
     else{
        document.getElementById("nav-in-list").style.display="block"; 
    }
   }

