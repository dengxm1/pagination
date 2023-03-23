(function($){
    var _defalut = {};
    _defalut.option = {
        current:1, //当前页
        pageSize:20, //每页条数
        total:160 //总条数
    }
    var Pagenation = function(ele,option){
        this.$ele = $(ele);
        this.option = $.extend(_defalut.option ,option);
        this.initPagination();
        return {
            option:this.option,
            initPagination:$.proxy(this.initPagination, this)
        }
    };

    Pagenation.prototype.initPagination = function(){
        /* 
            1.页码>=8的时候显示省略号：除了前后箭头的方块，中间的方块永远只有7个。

            2.省略号出现的情况:
                前边的省略号，首页页码，省略号，后面的页码，current,省略号一定是省略了2个页码，只有首页与current-1之间的页面>=2的时候才显示为省略号，否则直接显示页码，不显示省略号，
                根据这个逻辑，我们可以推算出前边省略号出现的条件是current>4
                后边的省略号：current,后面一个页码，省略号，末页页码，后面省略号与current之间的关系，current < totalPage - 3;
                1.只显示前面的省略号: current>4 并且!(current < totalPage - 3), 得出current >= totalPage - 3,
                2.只显示后面的省略号 !(current>4)并且current < totalPage - 3; 得出 current <=4
                3.前后都显示： current>4 && current < totalPage - 3; 

            3.页码渲染from,to的情况（from,to是用于渲染省略号两端或一端连续的页码）
                1. 只显示前边的省略号，前边是第一个页码，然后是一个省略号，7-2 = 5，后边是连续的五个页码：
                    from  = totalPage - 5 + 1 ; to = totalPage;
                2. 只显示后面的省略号，后边是一个省略号，然后是最后一个页码，7-2 = 5，所以前面是连续五个页码
                   from = 1; to = 5
                3.前后省略号都显示：第一个页码，省略号，中间三个(current是三个中间的那一个)，省略号，最后一个页码
                    from =  current - 1; to = from + 2;
        */ 
        var html = [];
        let from,
            to,
            current = this.option.current,
            $pre,$next,$number; //用于渲染省略号之间连续的页码的起始下标
        this.totalPage = this.option.total%this.option.pageSize>0?this.option.total/this.option.pageSize +1:this.option.total/this.option.pageSize; //总页数
        html.push('<div class="pagenation-container"><div class="pagenation-describe"></div><ul class="pagenation-list">','<li class="page-pre"><a href="javascript:void(0);"><</a></li>');

        if(this.totalPage < 8) {
            from = 1;
            to = this.totalPage
        }
        if(this.totalPage >=8){
            // 只显示前面的省略号
            if(current >= this.totalPage - 3){
                from = this.totalPage - 4;
                to = this.totalPage;
                html.push('<li class="page-number"><a href="javascript:void(0);">',1,'</a></li>');   
                html.push('<li class="page-first-separator disable"><a href="javascript:void(0);">...</a></li>')
            }
            // 只显示后面的省略号
            if(current <=4){
                from = 1;
                 to = 5
            }
            // 前后省略号都显示
            if(current>4 && current < this.totalPage - 3){
                from =  current - 1; 
                to = from + 2;
                html.push('<li class="page-number"><a href="javascript:void(0);">',1,'</a></li>');   
                html.push('<li class="page-first-separator disabled"><a href="javascript:void(0);">...</a></li>')
            }
        }
      
        for(let i = from; i <= to; i++){
            html.push('<li class="page-number '+ (i == current?"active":"") +'"><a href="javascript:void(0);">',i,'</a></li>');
        }
        if(this.totalPage>=8){
            // 只显示后面的省略号
            if(current <=4){
                html.push('<li class="page-last-separator disable"><a href="javascript:void(0);">...</a></li>');
                html.push('<li class="page-number"><a href="javascript:void(0);">',this.totalPage,'</a></li>');   
            }
            // 前后省略号都显示
            if(current>4 && current < this.totalPage - 3){
                html.push('<li class="page-first-separator disabled"><a href="javascript:void(0);">...</a></li>')
                html.push('<li class="page-number"><a href="javascript:void(0);">',this.totalPage,'</a></li>');   
            }
        }

        html.push('<li class="page-next"><a href="javascript:void(0);">></a></li></ul></div>');

        this.$ele.empty().append(html.join(''));
        $pre = this.$ele.find('.page-pre');
        $next = this.$ele.find('.page-next');
        $number = this.$ele.find('.page-number');

        if (current === 1) {
            $pre.addClass('disabled');
        }

        if (current === this.totalPage) {
            $next.addClass('disabled');
        }
  
        $pre.off('click').on('click',$.proxy(this.onPagePre,this))    
        $next.off('click').on('click',$.proxy(this.onPageNext,this))    
        $number.off('click').on('click',$.proxy(this.onPageNumber,this))
    }

    Pagenation.prototype.onPagePre = function(event){
        if(this.option.current == 1){
            return
        }else{
            this.option.current--;
            this.updatePagination(event)
        }
    }
    Pagenation.prototype.onPageNext = function(event){
        if(this.option.current == this.totalPage){
            return
        }else{
            this.option.current++;
            this.updatePagination(event)
        }
    }
    Pagenation.prototype.onPageNumber = function(event){
        if(this.option.current == $(event.currentTarget).text()){
            return
        }
        this.option.current = $(event.currentTarget).text();
        this.updatePagination(event)
    }
    Pagenation.prototype.updatePagination = function(event){
        let onChange = this.option.onChange || function(){}
        if(event && $(event.currentTarget).hasClass('disabled')){
            return;
        }
        onChange(this.option.current)
        this.initPagination()
    }


    $.fn.pagenation = function(option){
       $.data(this,new Pagenation(this,option));
       return this
    }
}) (jQuery)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         