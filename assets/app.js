$(document).ready(function() {
    $(document).on("click", "#saveArticle", function(){
        var data= {
            title: $(this).attr("data-header"),  
            link: $(this).attr("data-link")

        }
        console.log(data); 
        $.post('/api/save-article', data, function(res){
            alert('Your article has been saved');
            console.log(res);
        })
    } )
} )