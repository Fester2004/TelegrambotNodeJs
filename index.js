const TelegramBot = require('node-telegram-bot-api');
const token = "886181790:AAGF-2IizyoabVLuAHCj4ySskv0K6Pl_BmM";
const bot = new TelegramBot(token,{polling: true});
const fs = require('fs');
let chatId = 0,name,mainStart = false,gameEnd = true,rid = 'null',chn = false,error = 0;
//  COMMANDS
bot.onText(/\/developers/,msg => {
 	let text = "*Розробник:Dima Lapchak(Dimon)*\n*Сценарист:SilverPesona(Erick)*";
 	bot.sendMessage(msg.chat.id,text,{
 		parse_mode:'Markdown'
 	});

 });
bot.onText(/\/name(.+)/,(msg,arr)=>{
	name = arr[1];
	bot.sendMessage(msg.chat.id,"Ваше і\'мя:"+name+" погнали!");
	chn = 'Вибрано';

});
bot.onText(/\/activehistory/,msg => {
	let text = 'На даний момент доступний сюжет за Сотника та Дворянина,в майбутньому будуть добавлені сюжетні лінії за Кріпака та Козака.';
	bot.sendMessage(msg.chat.id,text);

});
bot.onText(/\/restart/,msg=>{
	mainStart = false;
	gameEnd = true;
	rid = 'null';
	chn = false;
	error = 0;
	mainStart = true;
	let text = 'Хай,мене звати Prototype2004,вибери одну із кнопок для продовження.Для перегляду пророблених історій відправ /activehistory.';
	bot.sendMessage(msg.chat.id,text,{
		reply_markup:{
			inline_keyboard:[
				[
					{
						text:'Статус Бота',
						callback_data:'status'
					}
				],
				[
					{
						text:'Завершити Гру',
						callback_data:'endGame'
					},
					{
						text:'Почати Гру',
						callback_data:"start"
					}
				],
				[
					{
						text:'Розробник',
						url:'https://www.facebook.com/profile.php?id=100012029650942'
					},
					{
						text:'Сценарист',
						url:'https://www.facebook.com/erick.burish.7?fref=profile_friend_list&hc_location=friends_tab'
					}
				]
			]
		}
	});
	choosename();


});
bot.onText(/\/admin/,msg=>{

	if(msg.chat.id === 561773833){
		bot.sendMessage(msg.chat.id,"Привіт ,Діма");

	}else {
		bot.sendMessage(msg.chat.id,"Ви не розробник");
	}


});
// TEXT
bot.on('message',msg =>{
	chatId = msg.chat.id;

	// save name
	if(chn === true){
		name = msg.text;
		chn = 'Вибрано';
		switch (rid) {
			case 'Sotnuk':sotnuk();break;
			case 'Kripak':kripak();break;
			case 'Kozak':kozak();break;
			case 'Dvoranin':dvoranin();break;
		}
	}
	//menu start
   if(mainStart === false || msg.text === "/start" ){
   	mainStart = true;
   	 let text = 'Хай,мене звати Prototype2004,вибери одну із кнопок для продовження.Для перегляду пророблених історій відправ /activehistory.';
   	 bot.sendMessage(msg.chat.id,text,{
   	 	reply_markup:{
   	 		inline_keyboard:[
   	 			[
					{
						text:'Статус Бота',
						callback_data:'status'
					}
				],
				[
					{
						text:'Завершити Гру',
						callback_data:'endGame'
					},
					{
						text:'Почати Гру',
						callback_data:"start"
					}
				],
				[
					{
						text:'Розробник',
						url:'https://www.facebook.com/profile.php?id=100012029650942'
					},
					{
						text:'Сценарист',
						url:'https://www.facebook.com/erick.burish.7?fref=profile_friend_list&hc_location=friends_tab'
					}
				]
			]
		}
	 });
	   choosename();
   }
   //Вибір  роду
	switch(msg.text){
		case 'Сотник' : rid = 'Sotnuk';sotnuk();break;
		case 'Кріпак' : rid = 'Kripak';kripak();break;
		case 'Козак'  : rid = 'Kozak';kozak();break;
		case 'Дворянин' : rid = 'Dvoranin';dvoranin();break;
	}

});
//CALLBACK
bot.on('callback_query',query =>{
	if(chatId === 0){
		bot.answerCallbackQuery(query.id,"Ваш id невизначино!Напишіть щось в чат");
	}else if(error>2){
		bot.sendMessage(chatId,'Ведіть команду /name (ваше ім\'я) ,щоб продовжити');
		error = 'ok';
	}
	else if(query.data === 'status'){
    	bot.answerCallbackQuery(query.id,"Active/Ативний");
	}else if (gameEnd === false && query.data === 'start'){
		bot.answerCallbackQuery(query.id,'Гру вже почато');
	}else if (chn === true && query.data === "start"){
		error++;
		bot.answerCallbackQuery(query.id,"Вкажіть своє ім\'я");
	} else if(query.data === 'start' && gameEnd === true && chn === 'Вибрано'){
		gameEnd = false;
		bot.answerCallbackQuery(query.id,"Історія починається");
		start();
	}else if(gameEnd === true && query.data === 'endGame'){
		error++;
		bot.answerCallbackQuery(query.id,"Спочатку потрібно почати гру");
	}else if (query.data === 'endGame' && gameEnd!==true ) {
    	gameEnd =true;
    	bot.sendMessage(chatId,'Гра Завершина',{
    		reply_markup: {
    			remove_keyboard:true
			}
		});
	}
});
// 4 - First Choose
function start() {

   let text = 'На дворі 1648рік початок Національно-визвольної війни ,під приводом Богдана Хмельницького, ' +
	   ' ти є ';
   bot.sendMessage(chatId,text,{
   	reply_markup:{
   		keyboard:[
   			[
				{
					text:'Сотник'
				},
				{
					text:'Кріпак'
				}
			],
			[
				{
					text:'Козак'
				},
				{
					text:'Дворянин'
				}
			]
		]
	}
   });
}
// after choose rid
function dvoranin() {

		let text = 'Ви '+name+' народились в сім\'ї дворян, ваш рід Даниловичів тільки недавно зумів увійти в лави політичної еліти, ваш батько ще змалку готував вас до життя дворянина тому уже з раніх років ви почали відвідувати з батьком бали та празнитства уже тоді ви  усвідомлювати що в справах які стосуються дворян не можна обійтися без хитрощів та інтриг. Проте ваш батько не забув подбати і про ваш особистий захист, тому назначив для вас двох інструкторів та поставив перед вибором чим ви хотіли оволодіти ';
		bot.sendMessage(chatId,text,{
			reply_markup:{
				keyboard: [
					[
						{
							text:'Фехтування'
						}
					],
					[
						{
							text:'Стрільба'
						}
					]
				]
			}
		});


}
function kozak() {

}
function sotnuk() {
}
function kripak() {

}
// choose name
function choosename() {
	bot.sendMessage(chatId,"Вкажіть своє ім\'я",{
		reply_markup:{
			remove_keyboard: true
		}
	});
	chn = true;
}
// dvoranin
bot.on('message',msg => {
	if(chn === 'Вибрано' && rid === 'Dvoranin' && msg.text === 'Фехтування') {
		let text1 = 'В день вашого повноліття батько влаштував бенкет в вашу честь та запросив найближчих до вас дворян одними з таких дворян були ваші найближчі друзі : Олег та Ігор ви знайомі ще з дитинства \n' +
			'8 років назд\n' +
			'в перше ви зустрілись на балу , з якого пізніше таємно втікли  щоб перевірити які таємниці ховаються за стінами вашого володіння, проте замість секретів ви найшли лише поля та ліси на яких трудилтсь ваші кріпаки, повертаючись назад вам закрили дорогу декілька незнайомих вам людей , ви замітили що в них на поясі були пістолі,  подивившись на Олега та Ігоря на їх перелякане облича ви зрозуміти що вибирати як діяти прийдеться вам \n';
		bot.sendMessage(chatId,text1);
		let text = 'Ви навчались фехтуванню 8 років і досягнувши повноліття ви перевершили свого інструктора!';
		bot.sendMessage(chatId,text,{
			reply_markup:{
				keyboard:[
					[
						{
							text:'Заговорити з ними та запитати що їм потрібно.'
						}
					],
					[
						{
							text: 'Кинути  землю в очі незнайомців та кинутись до кріпаків'
						}
					]
				]
			}
		});
	}else if (chn === 'Вибрано' && rid === 'Dvoranin' && msg.text === 'Стрільба'){
		let text1 = 'В день вашого повноліття батько влаштував бенкет в вашу честь та запросив найближчих до вас дворян одними з таких дворян були ваші найближчі друзі : Олег та Ігор ви знайомі ще з дитинства \n' +
			'8 років назд\n' +
			'в перше ви зустрілись на балу , з якого пізніше таємно втікли  щоб перевірити які таємниці ховаються за стінами вашого володіння, проте замість секретів ви найшли лише поля та ліси на яких трудилтсь ваші кріпаки, повертаючись назад вам закрили дорогу декілька незнайомих вам людей , ви замітили що в них на поясі були пістолі,  подивившись на Олега та Ігоря на їх перелякане облича ви зрозуміти що вибирати як діяти прийдеться вам \n';
		bot.sendMessage(chatId,text1);
		let text = ' Ви навчались володіти різними видами вогнепальної зброї і досягнувши повноліття ви могли влучити в ціль на відстані 250 метрів . ';
		bot.sendMessage(chatId,text,{
			reply_markup:{
				keyboard:[
					[
						{
							text:'Заговорити з ними та запитати що їм потрібно.'
						}
					],
					[
						{
							text: 'Кинути  землю в очі незнайомців та кинутись до кріпаків'
						}
					]
				]
			}
		});
	}
	if(chn === 'Вибрано' && rid === 'Dvoranin' && msg.text === 'Заговорити з ними та запитати що їм потрібно.'){
		let text = 'ви невпевненим голосом питаєтесь що їм від вас потрібно?  (вони переглянулись і один із них навів на вас дуло пістоля поки другий намагався силою увести вас за собою, ви і ваші друзі намагались пручатись та кричати  але марно вас ніхто нечув так і  що зроблять декілька дітей?  дорослим !щей зі зброєю,(подумали ви)  ви вже губите всяку надію на порятунок аж раптом ви бачите як молодий хлопець на вигляд не старше вас показує в вашу сторону  кріпакам ';
		bot.sendMessage(chatId,text,{
			reply_markup:{
				keyboard:[
					[
						{
							text:'Закричати'
						}
					],
					[
						{
							text:'Вириватись самому'
						}
					]
				]
			}
		});
	}else if (chn === 'Вибрано' && rid === 'Dvoranin' && msg.text === 'Кинути  землю в очі незнайомців та кинутись до кріпаків'){
         let text = 'Ви піднімаєте з землі горсть землі і кидаєте в обличчя незнайомцям,земля попадає в обличчя одного але незаділо облича другого той наводе пістоль, Бах! В очах темніє ви падаєте не в змозі піднятись. Смерть! ';
         bot.sendMessage(chatId,text,{
         	reply_markup:{
         		remove_keyboard:true
			}
		 });
         bot.sendMessage(chatId,'Щоб почати зановов ведіть команду /restart');
	}
	if(chn === 'Вибрано' && rid === 'Dvoranin' && msg.text === 'Закричати'){
		let text = 'Ви набираєте повітря і кричите зі всіх сил, кріпаки почувши крик ринултсь на допомогу , один із незнайомців вистрілив в кріпака але невлучив, кріпаки прибігли швидше ніж незнайомці зуміли перезарядити пістолі, кріпаки повалили незнайомців а ви з друзями стояти в стороні обдумуючі все що з вами відбулось, но тут вас з пличе схопили(ви підстрибнули від здивування) обернувшись ви побачили того самого хлопця який замітив що вас намагались викрасти';
		bot.sendMessage(chatId,text,{
			reply_markup:{
				keyboard:[
					[
						{
							text:'Подякувати'
						}
					],
					[
						{
							text:'Демонстративно повернутись та піти з друзями в поміщення'
						}
					]
				]

			}
		});
	}else if(chn === 'Вибрано' && rid === 'Dvoranin' && msg.text === 'Вириватись самому'){
       let text = 'Ви намагались вириватись самому, ви вкусили одного із незнайомців (той від болі випускає вас)  але другий замічає і влучним пострілом попадає у вас"в очах темніє ви падаєте на землю.Смерть.';
       bot.sendMessage(chatId,text,{
       	reply_markup:{
       		remove_keyboard:true
		}
	   });
		bot.sendMessage(chatId,'Щоб почати зановов ведіть команду /restart');

	}
	if(chn === 'Вибрано' && rid === 'Dvoranin' && msg.text === 'Подякувати'){
		let text = 'Ви демонстративно кланяєтесь своєму рятівнику,він від здивування застив на декілька секунд, а коли прийшов до тями в відповідь поклонився і з усмішкою на лиці промовив: " Де це таке бачили, що господар кріпаку кланяється "-, ви здивувались але у відповідь промовили: \n' +
			'" ти нам життя врятував, за це я у тебе в боргу не лишусь,  якщо допомога потрібно буде так тільки скажи  " кріпак посміхнувся та сказав:" Мене Івном звуть а тебе?  "\n' +
			'Ви відповіли  '+name+' .Щож буду знати як мого господаря звати (веселим тоном проговорив Іван) \n' +
			'Ви усміхнулись, ще раз подякували кріпакам та вернултсь в поміщення на бал. \n';
		bot.sendMessage(chatId,text,{
			reply_markup:{
				remove_keyboard:true
			}
		});
		bot.sendMessage(chatId,"Кінець першої частини,щоб почати заново  введіть команду /restart");
	}else if (chn === 'Вибрано' && rid === 'Dvoranin' && msg.text === 'Демонстративно повернутись та піти з друзями в поміщення'){
		let text = 'Ви обдивились хлопця з ніг до голови (фиркнули)  і промовили :" Самі б  справились, не потрібно нам допомоги кріпаків "-, розвернулись, і пішли в поміщення. \n' +
			'Хлопець зі здивованим обличам стояв декілька секунд після чого отямивштсь розвернувся і пішов.\n';
		bot.sendMessage(chatId,text,{
			reply_markup:{
				remove_keyboard:true
			}
		});
		bot.sendMessage(chatId,"Кінець першої частини,щоб почати заново  введіть команду /restart");
	}
});