// Put this in the script section in JSFiddle
// In a local setup, you need to merge this and the index.html file into one file

var checkForDeaths = function (player, monster) {
	var ret = {};
	if (monster.health <= 0) {
		this.gameactive = false;
		ret.monsterMsg = 'Monster was slain!!!'
		ret.gameOver = true;
	}

	if (player.health <= 0) {
		this.gameactive = false;
		ret.playerMsg = 'Player was slain!!!'
		ret.gameOver = true;
	}

	return ret;
}

var calcDamage = function (entity, specialAttack) {
	var multiplier = 1;
	if (specialAttack) {
		if (Math.random() > 0.5) {
			return 0;
		}
		multiplier = 3;
	}
	var i = Math.floor(Math.random() * 10);
	return entity.damageRange[i] * multiplier;
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
			fullHealth: 100,
			health: 100,
			healthPercentage: '100%',
			damageRange: [0, 2, 2, 2, 3, 3, 4, 1, 1, 10],
			healRange: [1, 2, 2, 2, 3, 3, 4, 1, 1, 1]
		},

		monster: {
			fullHealth: 100,
			health: 100,
			healthPercentage: '100%',
			damageRange: [20, 20, 6, 2, 3, 3, 4, 1, 5, 5],
			healRange: [1, 2, 2, 2, 3, 3, 4, 1, 1, 1]
		},


		msgs: []
	},
	methods: {
		play: function (action) {
			console.log('action: ' + action);
			var ret = actions[action](this.player, this.monster);
			this.msgs.push(ret);
			this.gameactive = !ret.gameOver;

			ret = doMonsterAttack(this.player, this.monster);
			this.msgs.push(ret);

			ret = checkForDeaths(this.player, this.monster);
			if (ret.playerMsg || ret.monsterMsg) {
				this.msgs.push(ret);
				if (ret.gameOver) {
					this.gameactive = false;
				}
			}

			this.player.healthPercentage = Math.floor(this.player.health / this.player.fullHealth * 100) + '%';
			this.monster.healthPercentage = Math.floor(this.monster.health / this.monster.fullHealth * 100) + '%';
		},
		reset: function () {
			console.log('reset');
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
			return Math.floor(this.player.health / this.player.fullHealth * 100) + '%';
		},
		monsterHealthPercentage: function () {
			return Math.floor(this.monster.health / this.monster.fullHealth * 100) + '%';
		}

	}
})