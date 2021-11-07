/*
{
  "apps": [
    {
      "name": "Time Tag Bot",
      "cwd": "Discord-Time-Tag-Bot",
      "script": "npm",
      "args": "start",
      "autorestart": "true",
      "env_production": {
        "NODE_ENV": "production"
      }
    }
  ]
}
*/
module.exports = {
	apps : [{
		name: 'Time Tag Bot',
		script: 'npm',
		node_args:'start',
		watch: '.',
		cwd: '/Discord-Time-Tag-Bot',
	}],

	deploy : {
		production : {
			ref  : 'origin/master',
			repo : 'https://github.com/MRDGH2821/Discord-Time-Tag-Bot.git',
			path : '/Discord-Time-Tag-Bot',
			'pre-deploy-local': 'git pull',
			'post-deploy' : 'npm install && pm2 reload pm2.config.js --env production',
			'pre-setup': '',
		},
	},
};
