// Put this in the script section in JSFiddle
// In a local setup, you need to merge this and the index.html file into one file

var checkForDeaths = function (player, monster) {
	var ret = {};
	if (monster.health <= 0) {
		monster.healthPercentage = '0px';
		monster.health = 0;
		ret.monsterMsg = 'Monster was slain!!!'
		ret.gameOver = true;
	}

	if (player.health <= 0) {
		player.healthPercentage = '0px';
		player.health = 0;
		ret.playerMsg = 'Player was slain!!!'
		ret.gameOver = true;
	}

	return ret;
}

var calcDamage = function (entity, specialAttack) {
	var multiplier = 1;
	var i = Math.floor(Math.random() * 10);
	var damage = entity.damageRange[i];
	if (specialAttack) {
		var hit = Math.random();
		if (hit > 0.5) {
			return 0;
		}
		if (damage === 0) {
			damage = 3;
		}
		
		damage *= 3;
	}
	
	return damage;
}

var calcHeal = function (entity) {
	var i = Math.floor(Math.random() * 10);
	return entity.healRange[i];
}

var doMonsterAttack = function (player, monster) {
	var damage = calcDamage(monster);
	player.health -= damage;

	var msg = damage > 0 ? 'Monster hits player for ' + damage + ' damage' : 'Monster misses';
	return {
		monsterMsg: msg
	};
};

var actions = {
	ATTACK: function (player, monster) {
		var damage = calcDamage(player);
		monster.health -= damage;
		var msg = damage > 0 ? 'Player hits monster for ' + damage + ' damage' : 'Player misses';
		return {
			playerMsg: msg
		};
	},
	SPECIALATTACK: function (player, monster) {
		var damage = calcDamage(player, true);
		monster.health -= damage;

		var msg = damage > 0 ? 'Player hits monster for ' + damage + ' damage' : 'Player misses';
		return {
			playerMsg: msg
		};
	},
	HEAL: function (player, monster) {
		var heal = calcHeal(player);
		player.health += heal;
		if (player.health > player.fullHealth) {
			player.health = player.fullHealth;
		}


		return {
			playerMsg: 'Player is healed by ' + heal
		};
	},
	GIVEUP: function (player, monster) {
		msgs = {
			playerMsg: 'Player turns tail and runs',
			gameOver: true
		}

		return msgs;
	}

}
new Vue({
	el: '#app',
	data: {
		title: 'Vue Game',
		gameactive: false,

		player: {
			fullHealth: 150,
			health: 150,
			healthPercentage: '100%',
			damageRange: [0, 2, 2, 2, 3, 3, 4, 1, 1, 10],
			healRange: [10, 20, 20, 2, 3, 3, 4, 10, 10, 10]
		},

		monster: {
			fullHealth: 100,
			health: 100,
			healthPercentage: '100%',
			damageRange: [20, 20, 60, 2, 3, 3, 4, 10, 5, 5],
			healRange: [1, 2, 2, 2, 3, 3, 4, 1, 1, 1]
		},


		msgs: []
	},
	methods: {
		play: function (action) {
			var ret = actions[action](this.player, this.monster);
			this.msgs.splice(0, 0, ret);
			this.gameactive = !ret.gameOver;

			ret = doMonsterAttack(this.player, this.monster);
			this.msgs.splice(0, 0, ret);

			this.player.healthPercentage = Math.floor(this.player.health / this.player.fullHealth * 100) + '%';
			this.monster.healthPercentage = Math.floor(this.monster.health / this.monster.fullHealth * 100) + '%';

			ret = checkForDeaths(this.player, this.monster);
			if (ret.playerMsg || ret.monsterMsg) {
				this.msgs.splice(0, 0, ret);
				if (ret.gameOver) {
					this.gameactive = false;
				}
			}

		},
		reset: function () {
			this.msgs.splice(0);
			this.player.health = this.player.fullHealth;
			this.monster.health = this.monster.fullHealth;
			this.player.healthPercentage = '100%';
			this.monster.healthPercentage = '100%';
			this.gameactive = true;
		}
	},

	computed: {
		playerHealthPercentage: function () {
			var perc = Math.floor(this.player.health / this.player.fullHealth * 100);
			// if (perc < 0) {
			// 	perc = 0;
			// }
			return perc + '%';
		},
		monsterHealthPercentage: function () {
			var perc = Math.floor(this.monster.health / this.monster.fullHealth * 100);
			// if (perc < 0) {
			// 	perc = 0;
			// }
			return perc + '%';
		}

	}
})