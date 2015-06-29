/*
 *  nano FX plugin v1.0
 *  http://nanojs.org/plugins/fx
 *
 *  Copyright (c) 2008-2015 James Watts
 *  https://github.com/jameswatts
 *
 *  This is FREE software, licensed under the GPL
 *  http://www.gnu.org/licenses/gpl.html
 */

if (nano) {
	nano.plugin({
		fx: function _fx(type, args, fn) {
			if (typeof type !== 'string') type = 'default';
			if (nano.type(args) !== 'object') args = {};
			switch (type.toLowerCase()) {
				case 'create':
					return (nano.fx[type])? new nano.fx[type](this, args, fn) : false;
				case 'fade':
					new nano.fx.fade(this, args, fn).start();
					return this;
				case 'fadein':
					args.end = 1;
					new nano.fx.fade(this, args, fn).start();
					return this;
				case 'fadeout':
					args.end = 0;
					new nano.fx.fade(this, args, fn).start();
					return this;
				case 'toggle':
					if (this.visible()) {
						this.fx('fadeout', args, function() { this.hide(); });
					} else {
						this.opacity(0).show().fx('fadein');
					}
					return this;
				case 'move':
					new nano.fx.move(this, args, fn).start();
					return this;
				case 'resize':
					new nano.fx.resize(this, args, fn).start();
					return this;
				case 'transform':
					this.fx('resize', args, fn);
					this.fx('move', args);
					return this;
				case 'bounce':
					fn = fn || function() {};
					this.fx('move', {time: 200, y: this.y()-30}, function() {
						this.fx('move', {time: 250, y: this.y()+30}, function() {
							this.fx('move', {time: 200, y: this.y()-20}, function() {
								this.fx('move', {time: 200, y: this.y()+20}, function() {
									this.fx('move', {time: 200, y: this.y()-10}, function() {
										this.fx('move', {time: 100, y: this.y()+10}, fn);
									});
								});
							});
						});
					});
					return this;
				case 'jump':
					fn = fn || function() {};
					this.fx('move', {time: 100, y: this.y()+5}, function() {
						this.fx('move', {time: 250, y: this.y()-35}, function() {
							this.fx('move', {time: 200, y: this.y()+30}, fn);
						});
					});
					return this;
				case 'shake':
					fn = fn || function() {};
					this.fx('move', {time: 100, x: this.x()-15}, function() {
						this.fx('move', {time: 200, x: this.x()+30}, function() {
							this.fx('move', {time: 150, x: this.x()-25}, function() {
								this.fx('move', {time: 150, x: this.x()+20}, function() {
									this.fx('move', {time: 100, x: this.x()-15}, function() {
										this.fx('move', {time: 100, x: this.x()+5}, fn);
									});
								});
							});
						});
					});
					return this;
				case 'vibrate':
					fn = fn || function() {};
					this.fx('move', {time: 50, y: this.y()-3}, function() {
						this.fx('move', {time: 50, y: this.y()+3}, function() {
							this.fx('move', {time: 50, y: this.y()-3}, function() {
								this.fx('move', {time: 50, y: this.y()+3}, function() {
									this.fx('move', {time: 50, y: this.y()-3}, function() {
										this.fx('move', {time: 50, y: this.y()+3}, fn);
									});
								});
							});
						});
					});
					return this;
				case 'punch':
					fn = fn || function() {};
					this.fx('transform', {
						time: 150,
						x: this.x()-5,
						y: this.y()-5,
						w: this.w()+10,
						h: this.h()+10
					}, function() {
						this.fx('transform', {
							time: 250,
							x: this.x()+5,
							y: this.y()+5,
							w: this.w()-10,
							h: this.h()-10
						}, fn);
					});
					return this;
				case 'pinch':
					fn = fn || function() {};
					this.fx('transform', {
						time: 150,
						x: this.x()+5,
						y: this.y()+5,
						w: this.w()-10,
						h: this.h()-10
					}, function() {
						this.fx('transform', {
							time: 250,
							x: this.x()-5,
							y: this.y()-5,
							w: this.w()+10,
							h: this.h()+10
						}, fn);
					});
					return this;
				case 'pulse':
					fn = fn || function() {};
					var time = args.time || 300;
					var rate = args.rate || 30;
					var start = (nano.isset(args.start))? args.start : 1;
					var end = (nano.isset(args.end))? (args.end < 0.1)? 1 : 0 : (this.opacity() < 0.1)? 1 : 0;
					this.fx('fade', {
						time: time,
						rate: rate,
						start: start,
						end: end
					}, function() {
						this.fx('fade', {
							time: time,
							rate: rate,
							start: end,
							end: start
						}, fn);
					});
					return this;
				case 'blink':
					fn = fn || function() {};
					var time = args.time || 300;
					var obj = this;
					obj.toggle();
					setTimeout(function() {
						obj.toggle();
						fn();
					}, time);
					return this;
				case 'flash':
					fn = fn || function() {};
					var time1 = ((args.time/5)*4) || 800;
					var time2 = (args.time/5) || 200;
					var obj = this;
					obj.opacity(0);
					setTimeout(function() {
						obj.fx('fade', {
							time: time2,
							start: 0,
							end: 1
						}, function() {
							this.fx('fade', {
								time: time2,
								start: 1,
								end: 0
							}, fn);
						});
					}, time1);
					return this;
				case 'drop':
					fn = fn || function() {};
					this.fx('move', {
						time: args.time || 600,
						rate: args.rate || 30,
						y: this.y()+this.h()
					});
					this.fx('fade', {
						time: args.time || 600,
						rate: args.rate || 30,
						start: this.opacity(),
						end: 0.0
					}, fn);
					return this;
				case 'sink':
					fn = fn || function() {};
					this.fx('move', {
						time: args.time || 900,
						rate: args.rate || 30,
						y: this.y()+this.h()-1
					});
					this.fx('resize', {
						time: args.time || 900,
						rate: args.rate || 30,
						h: 1
					});
					this.fx('fade', {
						time: args.time || 900,
						rate: args.rate || 30,
						start: this.opacity(),
						end: 0.0
					}, fn);
					return this;
				case 'melt':
					fn = fn || function() {};
					var obj = this;
					obj.fx('move', {
						time: args.time || 1800,
						rate: args.rate || 30,
						x: this.x()-this.w()/2,
						y: this.y()+this.h()-1
					});
					obj.fx('resize', {
						time: args.time || 1800,
						rate: args.rate || 30,
						w: this.w()*2,
						h: 1
					});
					setTimeout(function() {
						obj.fx('fade', {
							time: ((args.time)? (args.time/2) : 900),
							rate: args.rate || 30,
							start: obj.opacity(),
							end: 0.0
						}, fn);
					}, ((args.time)? (args.time/2) : 900));
					return this;
				case 'shrink':
					fn = fn || function() {};
					this.fx('move', {
						time: args.time || 900,
						rate: args.rate || 30,
						x: this.x()+this.w()/4,
						y: this.y()+this.h()/2
					});
					this.fx('resize', {
						time: args.time || 900,
						rate: args.rate || 30,
						w: this.w()/2,
						h: this.h()/2
					});
					this.fx('fade', {
						time: args.time || 900,
						rate: args.rate || 30,
						start: this.opacity(),
						end: 0.0
					}, fn);
					return this;
				case 'grow':
					fn = fn || function() {};
					this.fx('move', {
						time: args.time || 900,
						rate: args.rate || 30,
						x: this.x()-this.w()/2,
						y: this.y()-this.h()
					});
					this.fx('resize', {
						time: args.time || 900,
						rate: args.rate || 30,
						w: this.w()*2,
						h: this.h()*2
					});
					this.fx('fade', {
						time: args.time || 900,
						rate: args.rate || 30,
						start: this.opacity(),
						end: 0.0
					}, fn);
					return this;
				case 'fold':
					fn = fn || function() {};
					this.fx('move', {
						time: args.time || 600,
						rate: args.rate || 30,
						y: this.y()+((this.h()/2)-1)
					});
					this.fx('resize', {
						time: args.time || 600,
						rate: args.rate || 30,
						h: 2
					});
					this.fx('fade', {
						time: args.time || 600,
						rate: args.rate || 30,
						start: this.opacity(),
						end: 0.0
					}, fn);
					return this;
				case 'pack':
					fn = fn || function() {};
					var time = args.time || 600;
					var rate = args.rate || 30;
					this.fx('resize', {
						time: time,
						rate: args.rate,
						w: this.w()/2
					}, function() {
						this.fx('resize', {
							time: time,
							rate: rate,
							h: this.h()/2
						}, function() {
							this.fx('fade', {
								time: time,
								rate: rate,
								start: this.opacity(),
								end: 0.0
							}, fn)
						});
					});
					return this;
				case 'evaporate':
					fn = fn || function() {};
					this.fx('move', {
						time: args.time || 1000,
						rate: args.rate || 30,
						x: this.x()-this.w()/20,
						y: this.y()-this.h()/2
					});
					this.fx('resize', {
						time: args.time || 1000,
						rate: args.rate || 30,
						w: this.w()+this.w()/10,
						h: this.h()+this.h()/10
					});
					this.fx('fade', {
						time: args.time || 1000,
						rate: args.rate || 30,
						start: this.opacity(),
						end: 0.0
					}, fn);
					return this;
				case 'implode':
					fn = fn || function() {};
					this.fx('move', {
						time: args.time || 600,
						rate: args.rate || 30,
						x: this.x()+this.w()/4,
						y: this.y()+this.h()/4
					});
					this.fx('resize', {
						time: args.time || 600,
						rate: args.rate || 30,
						w: this.w()/2,
						h: this.h()/2
					});
					this.fx('fade', {
						time: args.time || 600,
						rate: args.rate || 30,
						start: this.opacity(),
						end: 0.0
					}, fn);
					return this;
				case 'explode':
					fn = fn || function() {};
					this.fx('move', {
						time: args.time || 600,
						rate: args.rate || 30,
						x: this.x()-this.w()/2,
						y: this.y()-this.h()/2
					});
					this.fx('resize', {
						time: args.time || 600,
						rate: args.rate || 30,
						w: this.w()*2,
						h: this.h()*2
					});
					this.fx('fade', {
						time: args.time || 600,
						rate: args.rate || 30,
						start: this.opacity(),
						end: 0.0
					}, fn);
					return this;
				case 'morph':
					fn = fn || function() {};
					var obj = nano(args.id);
					this.fx('move', {
						time: args.time || 900,
						rate: args.rate || 30,
						x: obj.x(),
						y: obj.y()
					});
					this.fx('resize', {
						time: args.time || 900,
						rate: args.rate || 30,
						w: obj.w(),
						h: obj.h()
					}, fn);
					return this;
				default:
					return this;
			}
		}
	}, function() {
		this.fx = {
			cache: {},
			start: function _start(id) {
				this.cache[id].interval = setInterval('nano.fx.cache["' + id + '"].run();', this.cache[id].rate);
				this.cache[id].paused = false;
				this.cache[id].stopped = false;
			},
			pause: function _pause(id) {
				clearInterval(this.cache[id].interval);
				this.cache[id].paused = true;
				this.cache[id].stopped = false;
			},
			stop: function _stop(id) {
				clearInterval(this.cache[id].interval);
				this.cache[id].paused = false;
				this.cache[id].stopped = true;
			},
			fade: function _fade(node, args, fn) {
				this.id = nano.uniq();
				nano.fx.cache[this.id] = this;
				this.node = node;
				this.time = {
					elapsed: 0,
					end: (nano.isset(args.time))? args.time : 1000
				};
				this.rate = 1000/((nano.isset(args.rate))? args.rate : 50);
				if (typeof fn === 'function') this.callback = fn;
				this.start = function start() {
					nano.fx.start(this.id);
				};
				this.pause = function pause() {
					nano.fx.pause(this.id);
				};
				this.stop = function stop() {
					nano.fx.stop(this.id);
				};
				this.opacity = {
					first: (nano.isset(args.start))? args.start : this.node.opacity(),
					last: (nano.isset(args.end))? args.end : 0.5
				};
				this.opacity.difference = this.opacity.last-this.opacity.first;
				this.run = function _run() {
					this.time.elapsed += this.rate;
					if (this.time.elapsed >= this.time.end) this.time.elapsed = this.time.end;
					var scale = this.time.elapsed/this.time.end;
					var new_opacity = this.opacity.first+(scale*this.opacity.difference);
					this.node.opacity(new_opacity);
					if (this.time.elapsed == this.time.end) {
						this.stop();
						if (typeof this.callback === 'function') this.callback.call(this.node);
					}
				};
			},
			move: function _move(node, args, fn) {
				this.id = nano.uniq();
				nano.fx.cache[this.id] = this;
				this.node = node;
				this.time = {
					elapsed: 0,
					end: (nano.isset(args.time))? args.time : 1000
				};
				this.rate = 1000/((nano.isset(args.rate))? args.rate : 50);
				if (typeof fn === 'function') this.callback = fn;
				this.start = function start() {
					nano.fx.start(this.id);
				};
				this.pause = function pause() {
					nano.fx.pause(this.id);
				};
				this.stop = function stop() {
					nano.fx.stop(this.id);
				};
				this.x = {
					first: this.node.x(),
					last: (nano.isset(args.x))? args.x : this.node.x()
				};
				this.y = {
					first: this.node.y(),
					last: (nano.isset(args.y))? args.y : this.node.y()
				};
				this.node.css.display = 'block';
				this.node.css.position = 'absolute';
				this.run = function _run() {
					this.time.elapsed += this.rate;
					if (this.time.elapsed >= this.time.end) this.time.elapsed = this.time.end;
					this.x.distance = Math.floor(this.x.last)-this.x.first;
					this.y.distance = Math.floor(this.y.last)-this.y.first;
					var scale = this.time.elapsed/this.time.end;
					var move_x = this.x.first+(scale*this.x.distance);
					var move_y = this.y.first+(scale*this.y.distance);
					this.node.moveTo(move_x, move_y);
					if (this.time.elapsed == this.time.end) {
						this.stop();
						if (typeof this.callback === 'function') this.callback.call(this.node);
					}
				};
			},
			resize: function _resize(node, args, fn) {
				this.id = nano.uniq();
				nano.fx.cache[this.id] = this;
				this.node = node;
				this.time = {
					elapsed: 0,
					end: (nano.isset(args.time))? args.time : 1000
				};
				this.rate = 1000/((nano.isset(args.rate))? args.rate : 50);
				if (typeof fn === 'function') this.callback = fn;
				this.start = function start() {
					nano.fx.start(this.id);
				};
				this.pause = function pause() {
					nano.fx.pause(this.id);
				};
				this.stop = function stop() {
					nano.fx.stop(this.id);
				};
				this.w = {
					first: this.node.w(),
					last: (nano.isset(args.w))? args.w : this.node.w()
				};
				this.h = {
					first: this.node.h(),
					last: (nano.isset(args.h))? args.h : this.node.h()
				};
				this.run = function _run() {
					this.time.elapsed += this.rate;
					if (this.time.elapsed >= this.time.end) this.time.elapsed = this.time.end;
					this.w.distance = Math.floor(this.w.last)-this.w.first;
					this.h.distance = Math.floor(this.h.last)-this.h.first;
					var scale = this.time.elapsed/this.time.end;
					var resize_w = this.w.first+(scale*this.w.distance);
					var resize_h = this.h.first+(scale*this.h.distance);
					this.node.resizeTo(resize_w, resize_h);
					if (this.time.elapsed == this.time.end) {
						this.stop();
						if (typeof this.callback === 'function') this.callback.call(this.node);
					}
				};
			},
			color: function _color(node, args, fn) {}
		};
	});
}
