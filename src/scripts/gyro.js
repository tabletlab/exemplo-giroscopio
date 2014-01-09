;(function($) {
	Gyro = {
		// Cache
		eCanvas: null,
		ctxCanvas: null,
		firstHeading: null,

		// Confs
		pixelsPorGrauAlpha: 27,
		grausPorImagem: null,
		larguraPorImagem: 1215,
		totalDeImagens: 8,

		init: function() {
			var self = this;
			window.ondevicemotion = function(event) {
				if(!event.acceleration) {
					self.semGiroscopio();
				} else {
					self.start();		
				}
				window.ondevicemotion = null;
			}
		},

		start: function() {
			if (TL.sysInfo().appleDevice) {
				//TabletLab.Debug.ativar();
				var self = this;

				TabletLab.Debug.track("Orientacao_Entrada", window.orientation);

				var $canvas = $("<canvas />");
				$canvas.attr("id", "canvas360");
				$("body").append($canvas);
				self.eCanvas = document.getElementById('canvas360');
				self.ctxCanvas = self.eCanvas.getContext('2d');

				// Ajuste de calculos
				self.grausPorImagem = 360/self.totalDeImagens;
			
				if(!window.DeviceOrientationEvent) {
					alert("nope");
					die();
				}

				window.addEventListener("resize", self.ajustaCanvas);
				window.addEventListener("deviceorientation", self.renderiza);
				self.ajustaCanvas();

				//self.renderiza();
			} else {
				$('.atribuicao').hide();
				$('#alert').html('Este recurso não está disponível para esta plataforma em tablets Android.');
				$('#alert').show();
			}
		},

		semGiroscopio: function() {
			var self = this;
			$('.atribuicao').hide();
			$('#alert').html('Este recurso não está disponível no seu tablet.');
			$('#alert').show();
			window.removeEventListener("deviceorientation", self.renderiza);
		},

		renderiza: function(e) {
			var self = Gyro;
			var alfa = null;
			if (event.webkitCompassHeading != undefined) {
				alfa = e.webkitCompassHeading;
			} else if (event.alpha != undefined && event.alpha != null) {
				alfa = e.alpha;
			}

			if(alfa==null) {
				self.semGiroscopio();
			}

			if(self.firstHeading == null){
				self.firstHeading = alfa;
			}

			//console.log(e);
			//var alfa = (Math.round(alfa)-360)*-1;
			var alfa = Math.round(alfa);
			//var alfa = heading;
			if(alfa==360) { alfa = 0; }

			TabletLab.Debug.track("Orientacao_Renderiza", window.orientation);
			TabletLab.Debug.track("Alfa", alfa);
			TabletLab.Debug.track("Beta", Math.round(e.beta));
			TabletLab.Debug.track("Gama", Math.round(e.gamma));
			
			//$("#debug").html(alfa + " " + Math.round(posicao));
			
			// Limpa a tela para renderizar
			//self.ctxCanvas.fillStyle = "rgb(255,255,255)";
			//self.ctxCanvas.fillRect(0, 0, self.eCanvas.width, self.eCanvas.height);

			var imagemAtualNum = Math.ceil(alfa/self.grausPorImagem);
			var imagemEsquerdaNum = imagemAtualNum-1;
			var imagemDireitaNum = imagemAtualNum+1;
			if(imagemEsquerdaNum<=0) { imagemEsquerdaNum = self.totalDeImagens}
			if(imagemDireitaNum>self.totalDeImagens) { imagemDireitaNum = 1}

			// DEBUG
			TabletLab.Debug.track("imagemEsquerdaNum", imagemEsquerdaNum);
			TabletLab.Debug.track("imagemAtualNum", imagemAtualNum);
			TabletLab.Debug.track("imagemDireitaNum", imagemDireitaNum);

			// POSICAO
			var posicao = self.pixelsPorGrauAlpha*(alfa-(imagemAtualNum*self.grausPorImagem));
			posicao *= -1;

			TabletLab.Debug.track("Posição", posicao);

			var imagemAtual = document.getElementById("matrizPanorama"+imagemAtualNum);
			var imagemEsquerda = document.getElementById("matrizPanorama"+imagemEsquerdaNum);

			var posYImagem = (imagemAtual.naturalHeight-window.innerHeight)*-1;

			self.ctxCanvas.drawImage(imagemAtual, posicao, posYImagem);
			self.ctxCanvas.drawImage(imagemEsquerda, posicao-self.larguraPorImagem, posYImagem);
		},

		ajustaCanvas: function() {
			var self = Gyro;
			self.eCanvas.width = window.innerWidth;
			self.eCanvas.height = window.innerHeight;
		}
	};


	// Adiciona as imagens e inicializa o exemplo
	$(document).ready(function() {
		for(var i=1; i<=Gyro.totalDeImagens; i++) {
			var $img = $("<img />");
			$img.attr("id", "matrizPanorama"+i);
			$img.attr("src", "img/monte_" + i + ".jpg");
			$("body").append($img);
		}

		$(window).load(function() {
			Gyro.init();
		});
	});
	
})(jQuery);