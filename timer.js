/**
 * author liwei
 * repos https://github.com/leaven/timer/
 * [Timer 倒计时]
 * @param {object} [el] [dom节点容器，唯一]
 * @param {number} [y] [target year]
 * @param {number} [m] [target month]
 * @param {number} [d] [target day]
 * @param {number} [h] [target hour]
 * @param {number} [m] [target minute]
 * @param {number} [s] [target second]
 * @type {[type]}
 */
var Timer = function(options) {
	var date =  new Date();
	var  _default = {
		currentTimeSpan : new Date().getTime()
	};
	this.callback = this.timeChangeCallback;
	this.timeOver = options.callback || function(){};
	this.options = $.extend(_default, options);
	this.init();
}
Timer.prototype = {
	init : function() {
		this.$container = this.options.el;
		this.$hour = [],
		this.$minute = [],
		this.$second = [];
		this.$hour.push(this.$container.find(".hour").find('b')[0], this.$container.find(".hour").find('b')[1]);
		this.$minute.push(this.$container.find(".minute").find('b')[0], this.$container.find(".minute").find('b')[1]);
		this.$second.push(this.$container.find(".second").find('b')[0], this.$container.find(".second").find('b')[1]);
		this.i = 0;
		this.parseTime();
		this.run();
	},
	//时间格式化函数，把时分秒都转化为数字展现
	parseTime : function() {
		//获取目标时间与当前时间的差值，最大单位到时，最小单位到秒
		var d_date = new Date((new Date(this.options.targetTimeSpan) - new Date(this.options.currentTimeSpan)));
		var d_d = d_date.getUTCDate() - 1;
		var d_h = d_date.getUTCHours() + d_d * 24;
		var d_m = d_date.getUTCMinutes();
		var d_s = d_date.getUTCSeconds();

		//将时间数值转化为具体对应的数字
		this.h = [],
		this.m = [],
		this.s = [];
		
		this.h.push(d_h % 10);
		this.h.unshift(parseInt(d_h / 10));

		this.m.push(d_m % 10);
		this.m.unshift(parseInt(d_m / 10));

		this.s.push(d_s % 10);
		this.s.unshift(parseInt(d_s / 10));
	},
	//时间改变的时候触发该回调
	timeChangeCallback : function() {
		this.render();
	},
	/**
	 * [changeTime description]
	 * @argument {number} [step] [每次递减的数值]
	 * @type {[type]}
	 */
	changeTime : function(step) {
		//重命名时间值，用于设定一个时间低位向高位借位的顺序，以及对应的位置的最大显示值
		//约定时间数组顺序由秒到时，从右到左，数组最后一个用于借位用
		if(this.s[1]==0&&this.s[0]==0&&this.m[1]==0&&this.m[0]==0&&this.s[1]==0&&this.s[0]==0){
			location.reload();
			//this.timeOver();
			return;
		}
			// return;
		var alias = [
			{
				c : this.s[1],
				limit : 9
			},
			{
				c : this.s[0],
				limit : 5
			},
			{
				c : this.m[1],
				limit : 9
			},
			{
				c : this.m[0],
				limit : 5
			},
			{
				c : this.h[1],
				limit : 9
			},
			{
				c : this.h[0],
				limit : 2
			},
			{
				c : 1
			}			
		];

		alias[0]['c'] -= step;

		//判断其中是否有负数
		for(var i = 0, len = alias.length - 1; i < len; i++) {
			if(alias[i]['c'] < 0) {
				alias[i]['c'] += alias[i]['limit']+1;
				alias[i+1]['c']--;
			}else {
				break;
			}

		}
		this.s[1] = alias[0]['c'];
		this.s[0] = alias[1]['c'];
		this.m[1] = alias[2]['c'];
		this.m[0] = alias[3]['c'];
		this.h[1] = alias[4]['c'];
		this.h[0] = alias[5]['c'];
		this.callback();
	},

	//定时器
	run : function() {
		var self = this;
		setInterval(function(){
			self.changeTime(1);
		},1000);
	},
	//渲染逻辑
	render : function() {
		$(this.$hour[0]).attr('class', 'number number' + this.h[0]).html(this.h[0]);
		$(this.$hour[1]).attr('class', 'number number' + this.h[1]).html(this.h[1]);
		$(this.$minute[0]).attr('class', 'number number' + this.m[0]).html(this.m[0]);
		$(this.$minute[1]).attr('class', 'number number' + this.m[1]).html(this.m[1]);
		$(this.$second[0]).attr('class', 'number number' + this.s[0]).html(this.s[0]);
		$(this.$second[1]).attr('class', 'number number' + this.s[1]).html(this.s[1]);
	}
};