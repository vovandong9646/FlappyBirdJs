$(document).ready(function(){


	//set các đối tượng cho dễ làm việc
	var container = $("#container"); 
	var bird = $("#bird");
	var pole = $(".pole");
	var pole1 = $("#pole1");
	var pole2 = $("#pole2");
	var play = $("#play");
	var score = $("#score");
	

	// 1 vài thiết lập
	var widthContainer = parseInt(container.width()); //lấy chiều rộng của container để tý kiểm tra xem thử cái ống nó ra khỏi container chưa
	var heightContainer = parseInt(container.height()); // lấy chiều cao của container để tý kiểm tra nó có đụng tường không
	var positionPole = parseInt(pole.css('right')); // lấy tọa độ ban đầu của ống để tý gán tọa độ ban đầu cho tọa độ hiện tại (reset cái tọa độ hiện tại về vị trí ban đầu)
	var heightPole = parseInt(pole.css('height')); //lấy chiều cao của ống nước để tý gán random cho chiều cao ống 1 với ống 2 
	var positionBird = parseInt(bird.css('left')); // lấy tọa độ con chim để kiểm tra va chạm
	var heightBird = parseInt(bird.height()); // lấy chiều cao của con chim để kiểm tra va chạm
	var speed = 10; // thiết lập mặc định cho đoạn đường ống nước di chuyển (di chuyển sang trái thêm 10px)

	//thiết lập trạng thái
	var go_up = false; // mới vào game thì k làm chi hết thì chim nó tự rơi xún
	var score_update = false; // mới vào game thì cho điểm nó không tự tăng
	var game_over = false; //mới vào game thì không cho nó game over


	//chạy game
	function playgame(){ //viết hàm để chạy game để sau bấm vào nút play thì nó chạy cái hàm này
		
		setInterval(function(){ //set số lần lặp lại trong bao nhiêu giây(40) của hành động (lặp lại mãi mãi)

			if(vacham(bird,pole1)// kiểm tra chim va chạm với ống trên 
			|| vacham(bird,pole2) // kiểm tra chim va chạm ống dưới
			|| parseInt(bird.css('top')) <= 0 //kiểm tra chim va chạm với khung trên  
			|| parseInt(bird.css('top')) > heightContainer-heightBird ){ //kiểm tra chim va chạm với khung dưới (chiều cao của khung - chiều cao của con chim) khi chim vừa đụng vào khung(còn trên màn hình còn nếu không có chiều cao chim thì chim nó rớt lun dưới màn hình và không thấy nó)
				stop_game();//nếu va chạm thì dừng game nghĩa là ta clearInterval của hàm playgame đi, và chạy cái game_over = true;
			}else{ //ngược lại không va chạm
				//lấy vị trí hiện tại của ống nước
				var position_current_pole = parseInt(pole.css('right'));
				//cập nhập điểm khi chim vượt qua đc 1 cái ống nước
				if(position_current_pole > widthContainer - positionBird){ // nếu vị trí ống hiện tại > chiều dài của khung - vị trí con chim
					if(score_update === false){ // nếu điểm update == false
						score.text(parseInt(score.text()) + 1);// cộng điểm lên 1 và gán vào điểm
						score_update = true; //update điểm bằng true
					}
				}
				//kiểm tra ống nước đi ra khỏi container chưa
				if(position_current_pole > widthContainer){
					//tạo 1 cái chiều cao ngẫu nhiên
					var new_height = parseInt(Math.random() * 100);
					// tạo ống nước ngẫu nhiên típ
					pole1.css("height",heightPole + new_height);
					pole2.css("height",heightPole - new_height);
					//xong cái gán score_update =false
					score_update = false;
					//gán vị trí ống nước ban đầu bằng với vị trí hiện tại
					position_current_pole = positionPole;

				}
				//di chuyển ống nước
				pole.css("right",position_current_pole+speed);

				// nếu không click thì bird nó rớt
				if(go_up === false){
					go_down();
				}

			}


		},40);

	}
	//click vào play

	$("#play").click(function(){
		playgame();
		$(this).hide();
	});

	// viết hàm nhấp chuột vào container thì nó bay lên
	$("#container").mousedown(function(){
		go_up = setInterval(up,40);
	});

	//viết hàm nhả chuột ra thì nó bay xún
	$("#container").mouseup(function(){
		clearInterval(go_up);
		go_up = false;
	});

	$(document).keydown(function(){
		go_up = setInterval(up,40);
	});

	$(document).keyup(function(){
		clearInterval(go_up);
		go_up = false;
	});
	// hàm chim bay lên
	function up(){
		bird.css("top",parseInt(bird.css("top")) - 20);
		bird.css("transform","rotate(-10deg)");
	}

	// hàm chim tự rơi
	function go_down(){
		bird.css("top",parseInt(bird.css('top')) + 10 );
		bird.css("transform","rotate(50deg)");
	}
	//hàm stop_game
	function stop_game(){
		clearInterval(playgame());
		game_over = true;
		$("#choilai").show();
		//hiện ra nút chơi lại
	}
	//bấm hàm chơi lại cái nó chơi lại
	$("#choilai").click(function(){
		location.reload();
	});
	//tạo hàm để xử lý va chạm

	function vacham($div1,$div2){

		//lấy các thông số trong div1 với div2
		var x1 = $div1.offset().left; // lấy tọa độ ngang
		var y1 = $div1.offset().top; //lấy tọa độ dọc
		var w1 = $div1.outerWidth(true); // lấy chiều rộng
		var h1 = $div1.outerHeight(true); // lấy chiều cao
		var b1 = x1 + w1;
		var r1 = y1 + h1;

		var x2 = $div2.offset().left;
		var y2 = $div2.offset().top;
		var w2 = $div2.outerWidth(true);
		var h2 = $div2.outerHeight(true);
		var b2 = x2 + w2;
		var r2 = y2 + h2; 

		//xử lý va chạm

		if(b1 < x2 || r1 < y2 || b2 < x1 || r2 < y1 ){
			return false;
		}else{
			return true;
		}

	}



});