/**
 * TabletLab.Debug
 * Library para mostrar uma janela de debug em algum canto da tela
 *
 * @author André Gumieri
 * @version 1.0
 */
if(!window['TabletLab']) { var TabletLab = {}; }
;(function($) {
	TabletLab.Debug = {
		$debug: null,
		initialized: false,
		configuracoes: {
			ativo: false,
			posicao: {bottom: 0, right: 0},
			css: {
				border: '1px solid #ccc',
				backgroundColor: '#eee',
				padding: '10px'
			},
			zIndex: 1234567890
		},
		idPrefix: "TabletLabDebug_",

		/**
		 * TabletLab.Debug.debugAtivo
		 * Função que retorna se o debug está ativo. Se estiver ativo e não estiver criado, já inicializa
		 *
		 * @return BOOL – true se estiver ativo ou false se não.
		 *
		 * @author André Gumieri
		 * @version 1.0
		 */
		debugAtivo: function() {
			var self = this;
			if(!self.initialized && self.configuracoes.ativo) {
				self.$debug = $("<div />");
				self.$debug.attr("id", "TabletLabDebug");
				self.$debug.css(self.configuracoes.css);
				self.$debug.css(self.configuracoes.posicao);
				self.$debug.css({
					"position": "absolute",
					"z-index": self.configuracoes.zIndex
				});

				$("body").prepend(self.$debug);
				self.initialized = true;
			}

			return self.configuracoes.ativo;
		},


		/**
		 * TabletLab.Debug.ativar();
		 * Ativa o debug
		 *
		 * @author André Gumieri
		 * @version 1.0
		 */
		ativar: function() {
			var self = this;
			self.configuracoes.ativo = true;
		},



		/**
		 * TabletLab.Debug.conf();
		 * Função que seta as configurações de debug
		 *
		 * @param OBJ configuracoes – Objeto com as configurações possíveis
		 *
		 * @author André Gumieri
		 * @version 1.0
		 */
		conf: function(configuracoes) {
			var self = this;
			self.configuracoes = $.extend(self.configuracoes, configuracoes);
		},



		/**
		 * TabletLab.Debug.create();
		 * Cria uma nova linha do box de debug
		 *
		 * @param STRING id - ID do elemento
		 * @param STRING title - Título do elemento
		 * @param STRING value - Valor inicial do elemento
		 *
		 * @return JQUERY – Elemento
		 */
		create: function(id, title, value) {
			var self = this;
			if(!self.debugAtivo()) { return false; }

			var $track = self.$debug.children("#"+self.idPrefix+id);
			if(!$track.is("*")) {
				$track = $("<div />");
				$track.attr("id", self.idPrefix+id);
				$track.css({
					paddingTop: 3,
					paddingBottom: 3,
					borderBottom: '1px solid rgba(0,0,0,0.3)',
					fontFamily: 'sans-serif'
				});

				var $titulo = $("<strong />");
				$titulo.html(id + ":");
				$titulo.css({
					fontWeight: 'bold',
					fontSize: 12,
					marginRight: 12
				});

				var $valor = $("<span />");
				$valor.css({
					fontSize: 12
				});

				$track.append($titulo);
				$track.append($valor);
				self.$debug.append($track);
			}
			return $track;
		},



		/**
		 * TabletLab.Debug.track();
		 * Faz o track de algum valor
		 *
		 * @param STRING id – ID do track
		 * @param STRING value – Valor que deve ser mostrado no debug
		 *
		 * @author André Gumieri
		 * @version 1.0
		 */
		track: function(id, value) {
			var self = this;
			if(self.debugAtivo()) {
				var idPrefix = self.idPrefix;
				var $track = self.$debug.children("#"+idPrefix+id);
				if(!$track.is("*")) {
					$track = self.create(id, id, "");
				}
				$track.children("span").html(value);
			}
		},


		/**
		 * TabletLab.Debug.plus();
		 * Adiciona 1 a cada vez que é chamado
		 *
		 * @param STRING id – ID do track
		 *
		 * @author André Gumieri
		 * @version 1.0
		 */
		plus: function(id) {
			var self = this;
			var value = parseInt($("#"+self.idPrefix+id).children("span").text());
			if(!value) { value = 1; }
			value++;
			self.track(id, value);
		},


		/**
		 * TabletLab.Debug.plusReset();
		 * Faz o reset de um track do tipo plus
		 *
		 * @param STRING id – ID do track
		 *
		 * @author André Gumieri
		 * @version 1.0
		 */
		plusReset: function(id) {
			var self = this;
			var value = 0;
			self.track(id, value);
		},


		/**
		 * TabletLab.Debug.activated();
		 * Nos elementos de um mesmo grupo, marca apenas o último executado
		 *
		 * @param STRING grupo – Nome do agrupamento
		 * @param STRING id – Identificador único do grupo
		 *
		 * @author André Gumieri
		 * @version 1.0
		 */
		activated: function(grupo, id) {
			var self = this;
			var $elem = $("#"+self.idPrefix+grupo+id);
			if(!$elem.is("*")) {
				$elem = self.create(self.idPrefix+grupo+id, id, "");
				$elem.addClass(self.idPrefix + grupo);
			}

			self.$debug.find("."+self.idPrefix + grupo).each(function() {
				$(this).children("span").html("");
			});
			$elem.children("span").html("ATIVO");
			//var value = parseInt($("#"+self.idPrefix+grupo+id).children("span").text());
			//if(!value) { value = 1; }
			//value++;
			//self.track(grupo+id, value);
		}

	};
})(jQuery);