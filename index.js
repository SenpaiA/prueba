
const
{
   WAConnection,
   MessageType,
   Presence,
   MessageOptions,
   Mimetype,
   WALocationMessage,
   WA_MESSAGE_STUB_TYPES,
   ReconnectMode,
   ProxyAgent,
   GroupSettingChange,
   waChatKey,
   mentionedJid,
   processTime,
} = require("@adiwajshing/baileys")
const qrcode = require("qrcode-terminal") 
const moment = require("moment-timezone") 
const fs = require("fs") 
const { color, bgcolor } = require('./lib/color')
const { help } = require('./lib/help')
const { donasi } = require('./lib/donasi')
const { fetchJson } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const { wait, simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const tiktod = require('tiktok-scraper')
const ffmpeg = require('fluent-ffmpeg')
const { removeBackgroundFromImageFile } = require('remove.bg')
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
const nsfw = JSON.parse(fs.readFileSync('./src/nsfw.json'))
const exclusive = JSON.parse(fs.readFileSync('./src/exclusive.json'))
const samih = JSON.parse(fs.readFileSync('./src/simi.json'))
const vcard = 'BEGIN:VCARD\n' 
            + 'VERSION:3.0\n' 
            + 'FN:Senpi Admin\n' 
            + 'ORG: Pengembang XBot;\n' 
            + 'TEL;type=CELL;type=VOICE;waid=593995743368:+593 99 574 3368\n' 
            + 'END:VCARD' 
prefix = '#'
blocked = []          

/********** LOAD FILE **************/

/********** END FILE ***************/
  
const time = moment().tz('Asia/Jakarta').format("HH:mm:ss")
const arrayBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const bulan = arrayBulan[moment().format('MM') - 1]
const config = {
    XBOT: 'Senpai Maid~', 
    instagram: 'tal vez', 
    nomer: 'wa.me/+593995743368',
    youtube: 'algun dia', 
    whatsapp: 'Comming soon', 
    tanggal: `TANGGAL: ${moment().format('DD')} ${bulan} ${moment().format('YYYY')}`,
    waktu: time
}

function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)} HORAS ${pad(minutes)} MINUTOS ${pad(seconds)} SEGUNDOS`
}


const { tanggal, waktu, instagram, whatsapp, youtube, nomer, ontime } = config



const { exec } = require("child_process")

const client = new WAConnection()

client.on('qr', qr => {
   qrcode.generate(qr, { small: true })
   console.log(`[ ${time} ] QR code is ready, subrek dulu yak ambipi team`)
})

client.on('credentials-updated', () => {
   const authInfo = client.base64EncodedAuthInfo()
   console.log(`credentials updated!`)

   fs.writeFileSync('./session.json', JSON.stringify(authInfo, null, '\t'))
})

fs.existsSync('./session.json') && client.loadAuthInfo('./session.json')

client.connect();

// client.on('user-presence-update', json => console.log(json.id + ' presence is => ' + json.type)) || console.log(`${time}: Bot by ig:@affis_saputro123`)

client.on('group-participants-update', async (anu) => {
		if (!welkom.includes(anu.jid)) return
		try {
			const mdata = await client.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `*??????????????????????????????????????????????????????????????????????????????????????????????????????????*\n\nBienvenido @${num.split('@')[0]}\n\n*????????????????????????????????????????????????????????????*\n${mdata.subject}\n*????????????????????????????????????????????????????????????* \n\n_*Espero que se sienta como en casa aqu??*_\n\n*S???i??? n???e???c???e???s???it???a??? a???y??????u???d???a???*\n*?????????* Comuniquese de con un administrador\n*?????????* Este es un bot de bienvenida, stickers y cosas varias`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Fue bueno mientras duro\n@${num.split('@')[0]} esperamos su regreso,bye`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
	client.on('CB:Blocklist', json => {
		if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})

	client.on('message-new', async (mek) => {
		try {
			if (!mek.message) return
			if (mek.key && mek.key.remoteJid == 'status@broadcast') return
			if (mek.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
			body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix)

			mess = {
				wait: '????????? ????????????????????????, ???????????????????????????? ????????????????????',
				success: '?????? ??? ??? ???????????????????? ????',
				error: {
					stick: 'Bueno, fall?? ;( , intenta repetir :v ',
					Iv: '???????? ???????????????????????? ???????????????????????? ??????????????????????????????????'
				},
				only: {
					group: '????????? ???????????????? ???????????????????? ',
					ownerG: '????????? ???????????????? ???????????????????????????????????????????? ',
					ownerB: '?????????  ???????????????? ???????????????????????????????????????????? ',
					admin: '????????? ???????????????? ???????????????????? ',
					Badmin: '????????? ???????? ???????????? ???????????????? ???????????? ???????????????????? '
				}
			}

			const botNumber = client.user.jid
			const ownerNumber = ["@s.whatsapp.net"] 
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupDesc = isGroup ? groupMetadata.desc : ''
            		const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isWelkom = isGroup ? welkom.includes(from) : false
			const isNsfw = isGroup ? nsfw.includes(from) : false
			const isSimi = isGroup ? samih.includes(from) : false
			const isExclusive = isGroup ? exclusive.includes(from) : false
			const isOwner = ownerNumber.includes(sender)
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				client.sendMessage(from, teks, text, {quoted:mek})
			}
			const sendMess = (hehe, teks) => {
				client.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
			}

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			switch(command) {
				case 'bisakah':
					bisakah = body.slice(1)
					const bisa =['Bisa','Tidak Bisa','Coba Ulangi']
					const keh = bisa[Math.floor(Math.random() * bisa.length)]
					client.sendMessage(from, 'Pertanyaan : *'+bisakah+'*\n\nJawaban : '+ keh, text, { quoted: mek })
					break
				case 'kapankah':
					kapankah = body.slice(1)
					const kapan =['Besok','Lusa','Tadi','4 Hari Lagi','5 Hari Lagi','6 Hari Lagi','1 Minggu Lagi','2 Minggu Lagi','3 Minggu Lagi','1 Bulan Lagi','2 Bulan Lagi','3 Bulan Lagi','4 Bulan Lagi','5 Bulan Lagi','6 Bulan Lagi','1 Tahun Lagi','2 Tahun Lagi','3 Tahun Lagi','4 Tahun Lagi','5 Tahun Lagi','6 Tahun Lagi','1 Abad lagi','3 Hari Lagi']
					const koh = kapan[Math.floor(Math.random() * kapan.length)]
					client.sendMessage(from, 'Pertanyaan : *'+kapankah+'*\n\nJawaban : '+ koh, text, { quoted: mek })
					break
           case 'apakah':
					apakah = body.slice(1)
					const apa =['Iya','Tidak','Bisa Jadi','Coba Ulangi']
					const kah = apa[Math.floor(Math.random() * apa.length)]
					client.sendMessage(from, 'Pertanyaan : *'+apakah+'*\n\nJawaban : '+ kah, text, { quoted: mek })
					break
				case 'rate':
					rate = body.slice(1)
					const ra =['4','9','17','28','34','48','59','62','74','83','97','100','29','94','75','82','41','39']
					const te = ra[Math.floor(Math.random() * ra.length)]
					client.sendMessage(from, 'Pertanyaan : *'+rate+'*\n\nJawaban : '+ te+'%', text, { quoted: mek })
					break
          case 'speed':
          case 'ping':
            await client.sendMessage(from, `Pong!!!!\nSpeed: ${processTime(t, moment())} _Second_`)
            break
				case 'help': 
				case 'menu':
					client.sendMessage(from, help(prefix), text)
					break
				case 'donasi':
				case 'donate':
					client.sendMessage(from, donasi(), text)
				break
				case 'Iri':
		        case 'iri?':
                case 'iri':
                   client.sendMessage(from, 'sound' + 'iri.mp3', {quoted: mek, ptt:true})
               break
            case 'abgjago':
            case 'abangjago':
                client.sendMessage(from, 'sound' + 'abangjago'+'mp3', {quoted: mek, ptt:true})
                break
            case 'tarekses':
            case 'tariksis':
            case 'tareksis':
            case 'tareeksis':
            case 'tareekses':
                client.sendMessage(from, './sound'+'/tarekses.mp3', {quoted: mek, ptt:true})
                break
            case 'welotka':
            case 'welutka':
            case 'kangcopet':
                client.sendMessage(dari, './sound'+'welot'+'mp3',{quoted: mek, ptt:true})
                break
				case 'info':
					me = client.user
					uptime = process.uptime()
					teks = `*Nombre del bot* : ${me.name}\n*PROPIETARIO* : *Senpia Maid*\n*AUTOR* : AMPIBI\n*Nombre del bot* : @${me.jid.split('@')[0]}\n*Prefix* : ${prefix}\n*Total de contactos bloqueados* : ${blocked.length}\n*EL ESTA ACTIVO DESDE HACE* : ${kyun(uptime)}`
					buffer = await getBuffer(me.imgUrl)
					client.sendMessage(from, buffer, image, {caption: teks, contextInfo:{mentionedJid: [me.jid]}})
					break
					
				case 'blocklist': 
					teks = '???????????????????? ???????????????? :\n'
					for (let block of blocked) {
						teks += `?????? @${block.split('@')[0]}\n`
					}
					teks += `???????????????????? : ${blocked.length}`
					client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": blocked}})
					break
					
                                case 'hidetag':
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply('kamu siapa?')
					var value = body.slice(9)
					var group = await client.groupMetadata(from)
					var member = group['participants']
					var mem = []
					member.map( async adm => {
					mem.push(adm.id.replace('c.us', 's.whatsapp.net'))
					})
					var options = {
					text: value,
					contextInfo: { mentionedJid: mem },
					quoted: mek
					}
					client.sendMessage(from, options, text)
					break
					
                               case 'quotemaker':
					var gh = body.slice(12)
					var quote = gh.split("|")[0];
					var wm = gh.split("|")[1];
					var bg = gh.split("|")[2];
					const pref = `Usage: \n${prefix}quotemaker teks|watermark|theme\n\nEx :\n${prefix}quotemaker ini contoh|bicit|random`
					if (args.length < 1) return reply(pref)
					reply(mess.wait)
					anu = await fetchJson(`https://terhambar.com/aw/qts/?kata=${quote}&author=${wm}&tipe=${bg}`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {caption: 'Nih anjim', quoted: mek})
					break
					
                               case 'phlogo':
					var gh = body.slice(9)
					var gbl1 = gh.split("|")[0];
					var gbl2 = gh.split("|")[1];
					if (args.length < 1) return reply('Teksnya mana um')
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/textpro?theme=pornhub&text1=${gbl1}&text2=${gbl2}`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break
					
                              case 'truth':
					const trut =['??Alguna vez te ha gustado alguien? ??Cu??nto tiempo? ',' Si puedes o si quieres, en GC / fuera de GC ??con qui??n har??s amistad? (??Puedes ser diferente / del mismo sexo) ',' ??Cu??l es tu mayor miedo? ',' ??Alguna vez te ha gustado alguien y has sentido a esa persona como t?? tambi??n? ',' ??C??mo se llama tu exnovio amigo que una vez te gust?? en secreto? ',' ??Alguna vez le has robado el dinero o el padre de tu madre? ??La raz??n? ',' ??Qu?? te hace feliz cuando est??s triste? ',' ??Alguna vez has tenido amor no correspondido? si alguna vez con quien? ??c??mo te sientes brou? ',' ??te ha enga??ado la gente? ',' lo m??s temido ',' qui??n es la persona m??s influyente en tu vida ',' qu?? cosas de orgullo te has puesto este a??o ',' qui??n es la persona que puede ponerte cachondo ',' ??Qui??n es la persona que alguna vez te puso cachondo ',' (bgi, que es musulm??n) nunca rez?? en todo el d??a? ',' ??Qui??n es el m??s cercano a tu tipo ideal de pareja aqu??? ',' ??Con qui??n le gusta jugar? ',' ??Con qui??n? rechazar a la gente? ??La raz??n por qu??? ',' Menciona el incidente que te hizo da??o y que todav??a recuerdas ',' ??Qu?? has logrado este a??o? ',' ??Cu??l fue tu peor h??bito en la escuela?']
					const ttrth = trut[Math.floor(Math.random() * trut.length)]
					truteh = await getBuffer(`https://i.ibb.co/K9JQXT2/d0604dc9ecbfdad5e320d3a8a0506da6.jpg`)
					client.sendMessage(from, truteh, image, { caption: '*VERDAD*\n\n'+ ttrth, quoted: mek })
					break
					
				case 'dare':
					const dare =['Env??a un mensaje a tu ex y dile "A??n me gustas','enamoramiento telef??nico / novia ahora y ss al jugador','pap a un miembro del grupo','Dile a la chica: "ERES TAN HERMOSA" y quedra estar contigo','ss llamada reciente de whatsapp','soltar emoticon "????????" cada vez que escribe en gc / pc durante 1 d??a','env??a una nota de voz y di ??puedo llamarte beb???','suelte la cita de la canci??n / cita, luego etiquete al miembro apropiado para la cita','usar fotos de perfil anime hasta por 3 d??as','escribir en el idioma local las 24 horas','Cambia el nombre a "Soy una ni??a linda, Luna" durante 5 horas ',' chatea para contactar con el pedido de acuerdo con tu% de bater??a, sigue dici??ndole "tengo suerte de verte ',' chatea con tu ex y dile" te amo, pgn back ',' registro de voz le??do surah al-kautsar ',' dijo "Estoy enamorado de ti, ??quieres ser mi novia?" al sexo opuesto con el que charlaste por ??ltima vez (entr??galo en wa / tele), espera a que responda, si ya ss, pasa aqu??','indica tu tipo de novia!','fotos de snap / post novia / crush','grita "ME GUSTA EL CAMOTE" luego env??e usando vn aqu??','fotografia tu cara y luego env??asela a uno de tus amigos','env??a tu foto con una leyenda, soy un ni??o adoptado','me gusta el pan nwn','grita "Nehro, te quiero nene" frente a tu casa','Cambie el nombre a "BOWO" durante 24 horas.','Finge estar pose??do, por ejemplo: posesi??n de maung, posesi??n de langostas, posesi??n de refrigerador, etc.']
					const der = dare[Math.floor(Math.random() * dare.length)]
					tod = await getBuffer(`https://i.ibb.co/K9JQXT2/d0604dc9ecbfdad5e320d3a8a0506da6.jpg`)
					client.sendMessage(from, tod, image, { quoted: mek, caption: '*RETO*\n\n'+ der })
					break	
					
				case 'rolette':
					const rolet =['Boom, mala suerte amigo, haz perdido\nIntente denuevo','Vaya suerte tienes amigo, sobreviviste a esta ronda','Boom, mala suerte amigo, haz perdido\nIntente denuevo ','Vaya suerte tienes amigo, sobreviviste a esta ronda','Boom, mala suerte amigo, haz perdido\nIntente denuevo','Vaya suerte tienes amigo, sobreviviste a esta ronda']
					const rol = rolet[Math.floor(Math.random() * rolet.length)]
					role = await getBuffer(`https://i.ibb.co/M2DZqcb/Ea-PROZJXs-AE4-QQz.jpg`)
					client.sendMessage(from, role, image, { caption: '*Juega con Bocchi*\n\n'+ rol, quoted: mek })
					break
					
				case 'chance':
					if (args.length < 1) return reply('??Que desea probar?')
					const texty = body.slice(8)
					const lvpc = Math.floor(Math.random() * 101) + 1
					client.sendMessage(from, `_Segun mis claculos super robot la probabilidad de:_\n\n_*${texty}*_\n\nser en realidad de ${lvpc}% posibles`,MessageType.text, { quoted: mek} )
           				break
					
				case 'arg':
					if (args.length < 1) return reply('??No diras nada?')
					const textar = body.slice(5)
					anu = await fetchJson(`http://simsumi.herokuapp.com/api?text=${textar}&lang=pt`, {method: 'get'})
					resp = (anu.success)
					client.sendMessage(from, `${resp}`,MessageType.text, { quoted: mek} )
					break
					
				case 'hentai':
					if (!isNsfw) return reply('NSFW no est?? activo')
					const hen =['https://cdn.nekos.life/erok/ero_kitsune_093.jpg','','https://cdn.nekos.life/classic/classic254.gif','https://cdn.nekos.life/classic/classic_049.gif','https://cdn.nekos.life/classic/classic_044.gif','https://cdn.nekos.life/classic/classic_003.gif','https://cdn.nekos.life/classic/classic_479.gif','https://cdn.nekos.life/Random_hentai_gif/Random_hentai_gifNB_1438.gif','https://cdn.nekos.life/Random_hentai_gif/Random_hentai_gifNB1023.gif','https://cdn.nekos.life/Random_hentai_gif/Random_hentai_gifNB0524.gif','https://cdn.nekos.life/Random_hentai_gif/Random_hentai_gifNB0852.gif','https://cdn.nekos.life/erok/ero_kitsune_033.png','https://cdn.nekos.life/erok/ero_kitsune_104.jpg','https://cdn.nekos.life/erok/ero_kitsune_004.png','https://cdn.nekos.life/erok/ero_kitsune_071.jpg','https://cdn.nekos.life/erok/ero_kitsune_002.png','https://cdn.nekos.life/erok/ero_kitsune_022.jpg','https://cdn.nekos.life/erok/ero_kitsune_022.jpg','https://cdn.nekos.life/erok/ero_kitsune_055.jpg','https://cdn.nekos.life/erok/ero_kitsune_025.jpg','https://cdn.nekos.life/erok/ero_kitsune_103.jpg','https://cdn.nekos.life/erok/ero_kitsune_028.png','https://cdn.nekos.life/erok/ero_kitsune_014.jpg','https://cdn.nekos.life/erok/ero_kitsune_005.jpg','https://cdn.nekos.life/erok/ero_kitsune_079.jpg','https://cdn.nekos.life/erok/ero_kitsune_046.jpg','https://cdn.nekos.life/erok/ero_kitsune_077.jpg',]
					const henta = hen[Math.floor(Math.random() * hen.length)]
					het = await getBuffer(`${henta}`)
					client.sendMessage(from, het, image, { caption: 'riko xd ', quoted: mek })
					break
				case 'blowjob':
					if (!isNsfw) return reply('NSFW no est?? activo')
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/nsfwblowjob?apikey=BotWeA`, {method: 'get'})
					imgt = (anu.result)
					pok = await getBuffer(imgt)
					client.sendMessage(from, pok, image, { quoted: mek })
					break

				case 'ihentai':
					if (!isNsfw) return reply('NSFW no est?? activo')
					anu = await fetchJson(`https://nekos.life/api/v2/img/erok`, {method: 'get'})
					imgt = (anu.url)
					pok = await getBuffer(imgt)
					client.sendMessage(from, pok, image, { quoted: mek })
					break	  

				case 'boobs':
					if (!isNsfw) return reply('NSFW no est?? activo')
					anu = await fetchJson(`https://nekos.life/api/v2/img/boobs`, {method: 'get'})
					imgt = (anu.url)
					pok = await getBuffer(imgt)
					client.sendMessage(from, pok, image, { quoted: mek })
					break	  
					
				case 'nsfwyuri':
					if (!isNsfw) return reply('NSFW no est?? activo')
					anu = await fetchJson(`https://nekos.life/api/v2/img/yuri`, {method: 'get'})
					imgt = (anu.url)
					pok = await getBuffer(imgt)
					client.sendMessage(from, pok, image, { quoted: mek })
					break

				case 'futanari':
					if (!isNsfw) return reply('NSFW no est?? activo')
					anu = await fetchJson(`https://nekos.life/api/v2/img/futanari`, {method: 'get'})
					imgt = (anu.url)
					pok = await getBuffer(imgt)
					client.sendMessage(from, pok, image, { quoted: mek })
					break	

				case 'nsfwneko':
					if (!isNsfw) return reply('NSFW no est?? activo')
					anu = await fetchJson(`https://nekos.life/api/v2/img/lewdkemo`, {method: 'get'})
					imgt = (anu.url)
					pok = await getBuffer(imgt)
					client.sendMessage(from, pok, image, { quoted: mek })
					break

				
			    	case 'confirmas?':
					const conf =['https://i.ibb.co/Z85HKDv/en-un-rato-te-confirmo.jpg','https://i.ibb.co/qncWWRw/Desconfirmo.jpg','https://i.ibb.co/2qykqmx/confirmamos.jpg','https://i.ibb.co/C7v9qvq/confirmo.jpg']
					const conif = conf[Math.floor(Math.random() * conf.length)]
					confirma = await getBuffer(`${conif}`)
					client.sendMessage(from, confirma, image, { caption: '*EL BOT....*', quoted: mek })
					break
					
				case 'waifu':
				   	anu = await fetchJson(`https://arugaz.herokuapp.com/api/waifu`)
				  	buf = await getBuffer(anu.image)
				   	texs = ` *anime name* : ${anu.name} \n*deskripsi* : ${anu.desc} \n*source* : ${anu.source}`
				   	client.sendMessage(from, buf, image, { quoted: mek, caption: `${texs}`})
				        break
					
	
                		case 'dewabatch':
                    			teks = body.slice(11)
                    			anu = await fetchJson(`https://arugaz.herokuapp.com/api/dewabatch?q=${teks}` , {method: 'get'})
                    			thum = await getBuffer(anu.thumb)
                    			client.sendMessage(from, thum, image, {quoted: mek, caption: `${anu.result}`})
                 			break
					
					
                		case 'bug':
                     			const pesan = body.slice(5)
                      			if (pesan.length > 300) return client.sendMessage(from, '???????? ????????????????????????, ???????????????????? ???????????????????????????????????? ????????????????????, ?????????????????????????? ???????????? ????????????????????', msgType.text, {quoted: mek})
                        		var nomor = mek.participant
                       			const teks1 = `*[REPORT]*\nNomor : @${nomor.split("@s.whatsapp.net")[0]}\nPesan : ${pesan}`
                      			var options = {
                         		text: teks1,
                        		contextInfo: {mentionedJid: [nomor]},
                     			}
                    			client.sendMessage('593995743368@s.whatsapp.net', options, text, {quoted: mek})
                    			reply('Se han informado problemas al propietario del BOT, no se responder?? a los informes falsos.')
                    			break
					
                		case 'ssweb':
					if (args.length < 1) return reply('??D??nde est?? la url, t??o?')
					teks = body.slice(7)
					reply(mess.wait)
					anu = await fetchJson(`https://mnazria.herokuapp.com/api/screenshotweb?url=${teks}`)
					buff = await getBuffer(anu.gambar)
					client.sendMessage(from, buff, image, {quoted: mek})
					break
					
                		case 'bucin':
					gatauda = body.slice(7)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/howbucins`, {method: 'get'})
					reply(anu.desc)
					break
					
		        	case 'persengay':
					gatauda = body.slice(11)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/howbucins`, {method: 'get'})
					reply(anu.desc+anu.persen)
					break
					
				case 'quotes':
					gatauda = body.slice(8)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/randomquotes`, {method: 'get'})
					reply(anu.quotes)
					break
					
				case 'cerpen':
					gatauda = body.slice(8)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/cerpen`, {method: 'get'})
					reply(anu.result.result)
					break
					
				case 'chord':
					if (args.length < 1) return reply('??D??nde est?? el texto, t??o?')
					tels = body.slice(7)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/chord?q=${tels}`, {method: 'get'})
					reply(anu.result)
					break
					
              		  	case 'lirik':
                    			if (args.length < 1) return reply('donde esta el titulo de la cancion, tio')
                    			teha = body.slice(7)
                    			anu = await fetchJson(`https://arugaz.herokuapp.com/api/lirik?judul=${teha}` , {method: 'get'})
                    			reply(anu.result)
                			break
					
                		case 'pokemon':
					anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=pokemon`, {method: 'get'})
					reply(mess.wait)
					var n = JSON.parse(JSON.stringify(anu));
					var nimek =  n[Math.floor(Math.random() * n.length)];
					pok = await getBuffer(nimek)
					client.sendMessage(from, pok, image, { quoted: mek })
					break
					
				case 'meme':
					anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=meme`, {method: 'get'})
					reply(mess.wait)
					var n = JSON.parse(JSON.stringify(anu));
					var nimek =  n[Math.floor(Math.random() * n.length)];
					pok = await getBuffer(nimek)
					client.sendMessage(from, pok, image, { quoted: mek })
					break
				
				case 'cars':
				    	anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=cars`, {method: 'get'})
					reply(mess.wait)
					var n = JSON.parse(JSON.stringify(anu));
					var nimek =  n[Math.floor(Math.random() * n.length)];
					pok = await getBuffer(nimek)
					client.sendMessage(from, pok, image, { quoted: mek })
					break
					
				case 'bocchi':
					anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=bocchi`, {method: 'get'})
					reply(mess.wait)
					var n = JSON.parse(JSON.stringify(anu));
					var nimek =  n[Math.floor(Math.random() * n.length)];
					pok = await getBuffer(nimek)
					client.sendMessage(from, pok, image, { quoted: mek })
					break
		
				case 'animegirl':
					anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=anime%20girl`, {method: 'get'})
					reply(mess.wait)
					var n = JSON.parse(JSON.stringify(anu));
					var nimek =  n[Math.floor(Math.random() * n.length)];
					pok = await getBuffer(nimek)
					client.sendMessage(from, pok, image, { quoted: mek })
					break

				case 'animeimg':
					anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=anime`, {method: 'get'})
					reply(mess.wait)
					var n = JSON.parse(JSON.stringify(anu));
					var nimek =  n[Math.floor(Math.random() * n.length)];
					pok = await getBuffer(nimek)
					client.sendMessage(from, pok, image, { quoted: mek })
					break

				case 'loli':
					anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=loli`, {method: 'get'})
					reply(mess.wait)
					var n = JSON.parse(JSON.stringify(anu));
					var nimek =  n[Math.floor(Math.random() * n.length)];
					pok = await getBuffer(nimek)
					client.sendMessage(from, pok, image, { quoted: mek })
					break

                		case 'dogs':
					anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=anjing`, {method: 'get'})
					reply(mess.wait)
					var n = JSON.parse(JSON.stringify(anu));
					var nimek =  n[Math.floor(Math.random() * n.length)];
					pok = await getBuffer(nimek)
					client.sendMessage(from, pok, image, { quoted: mek })
					break
					
				case 'neko':
					anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=neko`, {method: 'get'})
					reply(mess.wait)
					var n = JSON.parse(JSON.stringify(anu));
					var nimek =  n[Math.floor(Math.random() * n.length)];
					pok = await getBuffer(nimek)
					client.sendMessage(from, pok, image, { quoted: mek })
					break

				case 'icon':
					anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=icon%20anime`, {method: 'get'})
					reply(mess.wait)
					var n = JSON.parse(JSON.stringify(anu));
					var nimek =  n[Math.floor(Math.random() * n.length)];
					pok = await getBuffer(nimek)
					client.sendMessage(from, pok, image, { quoted: mek })
					break
		
			   	case 'gato':
					anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=gato`, {method: 'get'})
					reply(mess.wait)
					var n = JSON.parse(JSON.stringify(anu));
					var nimek =  n[Math.floor(Math.random() * n.length)];
					pok = await getBuffer(nimek)
					client.sendMessage(from, pok, image, { quoted: mek })
					break
					
                		case 'spamcall':
                   			if (args.length < 1) return ('ingrese el n??mero de destino')
                   			weha = body.slice(10)
                   			anu = await fetchJson(`https://arugaz.herokuapp.com/api/spamcall?no=${weha}` , {method: 'get'})
                   			client.sendMessage(from, anu.logs, text, {quoted: mek})
                 			break
					
                		case 'indohot':
                   			if (!isNsfw) return reply('NSFW no est?? activo')
                   			anu = await fetchJson(`https://arugaz.herokuapp.com/api/indohot`, {method: 'get'})
                   			if (anu.error) return reply(anu.error)
                   			hasil = `*judul* \n${anu.result.judul} *genre* \n${anu.result.genre} *durasi* \n${anu.result.durasi} *url* \n${anu.result.url}`
                   			client.sendMessage(from, hasil, text, {quoted: mek})
                   			break
					
				case 'ytmp4':
					if (args.length < 1) return reply('??D??nde est?? la URL?')
					if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
					anu = await fetchJson(`https://st4rz.herokuapp.com/api/ytv2?url=${args[0]}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = `*Title* : ${anu.title}`
					thumb = await getBuffer(anu.thumb)
					client.sendMessage(from, thumb, image, {quoted: mek, caption: teks})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, video, {mimetype: 'video/mp4', filename: `${anu.title}.mp4`, quoted: mek})
					break
					
				case 'ytmp3':
					if (args.length < 1) return reply('??D??nde est?? la URL?')
					if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
					anu = await fetchJson(`https://st4rz.herokuapp.com/api/ytv2?url=${args[0]}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = `*Title* : ${anu.title}`
					thumb = await getBuffer(anu.thumb)
					client.sendMessage(from, thumb, image, {quoted: mek, caption: teks})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, audio, {mimetype: 'audio/mp4', filename: `${anu.title}.mp3`, quoted: mek})
					break
					
				case 'happymod':
					if (args.length < 1) return reply('??que aplicacion desea buscar?')
				  	data = await fetchJson(`https://tobz-api.herokuapp.com/api/happymod?q=${body.slice(10)}&apikey=BotWeA`, {method: 'get'})
				  	hupo = data.result[0] 
				  	teks = `*??? Nombre*: ${data.result[0].title}\n\n*??? Version*: ${hupo.version}\n\n*??? Peso:* ${hupo.size}\n\n*??? root*: ${hupo.root}\n\n*??? Precio*: ${hupo.price}\n\n*??? Link*: ${hupo.link}\n\n*??? Descarga*: ${hupo.download}`
				  	buffer = await getBuffer(hupo.image)
				  	client.sendMessage(from, buffer, image, {quoted: mek, caption: `${teks}`})
				  	break
					
                		case 'text3d':
              	    			if (args.length < 1) return reply('??D??nde est?? el texto sis?')
                    			teks = `${body.slice(8)}`
                    			if (teks.length > 10) return client.sendMessage(from, 'El texto es largo, un m??ximo de 10 frases', text, {quoted: mek})
                    			buff = await getBuffer(`https://docs-jojo.herokuapp.com/api/text3d?text=${teks}`, {method: 'get'})
                    			client.sendMessage(from, buff, image, {quoted: mek, caption: `${teks}`})
			     		break
					
			    	case 'fototiktok':
                    			gatauda = body.slice(12)
                    			anu = await fetchJson(`https://docs-jojo.herokuapp.com/api/tiktokpp?user=${gatauda}`)
			        	buff = await getBuffer(anu.result)
                    			reply(anu.result)
			        	break
					
			    	case 'map':
                			anu = await fetchJson(`https://mnazria.herokuapp.com/api/maps?search=${body.slice(5)}`, {method: 'get'})
                			buffer = await getBuffer(anu.gambar)
                			client.sendMessage(from, buffer, image, {quoted: mek, caption: `${body.slice(5)}`})
					break
               	 		case 'kbbi':
					if (args.length < 1) return reply('??Qu?? quieres buscar?')
					anu = await fetchJson(`https://mnazria.herokuapp.com/api/kbbi?search=${body.slice(6)}`, {method: 'get'})
					reply('Menurut Kbbi:\n\n'+anu.result)
					break
					
                		case 'artinama':
					if (args.length < 1) return reply('??Qu?? quieres buscar?')
					anu = await fetchJson(`https://mnazria.herokuapp.com/api/arti?nama=${body.slice(10)}`, {method: 'get'})
					reply('Menurut nama:\n\n'+anu.result)
					break
					
				case 'ocr': 
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						reply(mess.wait)
						await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
							.then(teks => {
								reply(teks.trim())
								fs.unlinkSync(media)
							})
							.catch(err => {
								reply(err.message)
								fs.unlinkSync(media)
							})
					} else {
						reply('???????????????????????? ???????????????????? ???????????? ?????????????????????????? ${prefix}????????????')
					}
					break
				case 'stiker': 
				case 'sticker':
				case 's':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								reply(mess.error.stick)
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						reply(mess.wait)
						await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(`Yah gagal ;(, coba ulangi ^_^`)
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
							} else {
						reply(`Enviar fotos con subt??tulos ${prefix}sticker o respuesta / etiqueta de imagen`)
					}
					break
				case 'getses':
            				if (!isOwner) return reply(mess.only.ownerB)
           			 	const sesPic = await client.getSnapshot()
            				client.sendFile(from, sesPic, 'session.png', '>~<...', id)
            				break
					
				case 'gtts':	
				case 'tts':
					if (args.length < 1) return client.sendMessage(from, 'C??digo de idioma requerido !!', text, {quoted: mek})
					const gtts = require('./lib/gtts')(args[0])
					if (args.length < 2) return client.sendMessage(from, '??Qu?? texto est??s haciendo voz? es mi voz :v?', text, {quoted: mek})
					dtt = body.slice(9)
					ranm = getRandom('.mp3')
					rano = getRandom('.ogg')
					dtt.length > 300
					? reply('El texto significa....')
					: gtts.save(ranm, dtt, function() {
						exec(`ffmpeg -i ${ranm} -ar 48000 -vn -c:a libopus ${rano}`, (err) => {
							fs.unlinkSync(ranm)
							buff = fs.readFileSync(rano)
							if (err) return reply('Bueno, fall?? ;( , intenta repetir :v')
							client.sendMessage(from, buff, audio, {quoted: mek, ptt:true})
							fs.unlinkSync(rano)
						})
					})
					break
					
				case 'setprefix':
					if (args.length < 1) return
					if (!isOwner) return reply(mess.only.ownerB)
					prefix = args[0]
					reply(`???????????????????????? ???????????????????????????????? ???????? ???????????????? ???????????????????????????? : ${prefix}`)
					break 
					
				case 'hilih': 
					if (args.length < 1) return reply('dame el texto!! >:v')
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/hilih?teks=${body.slice(7)}`, {method: 'get'})
					reply(anu.result)
					break
					
				case 'tiktokstalk':
					try {
						if (args.length < 1) return client.sendMessage(from, '???????????? ???????????????????????? ???????? ???????????????????????????? ?', text, {quoted: mek})
						let { user, stats } = await tiktod.getUserProfileInfo(args[0])
						reply(mess.wait)
						teks = `*ID* : ${user.id}\n*Username* : ${user.uniqueId}\n*Nickname* : ${user.nickname}\n*Followers* : ${stats.followerCount}\n*Followings* : ${stats.followingCount}\n*Posts* : ${stats.videoCount}\n*Luv* : ${stats.heart}\n`
						buffer = await getBuffer(user.avatarLarger)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: teks})
					} catch (e) {
						console.log(`Error :`, color(e,'red'))
						reply('[????????????????????] ???????????????????????????????????????????????? ???????????????????????? ???????? ???????????????????????????? ???????? ??????????????????????????')
					}
					break
					
				case 'fitnah':	
				case 'fake':          
               				if (!isGroup) return reply(mess.only.group)
                			arg = body.substring(body.indexOf(' ') + 1)
					isi = arg.split(' |')[0] 
					pesan = arg.split('|')[1] 
					pesan2 = arg.split('|')[2] 
                			reply(pesan, isi, pesan2)
                			break
					
                 		case 'linkgc':
				    	if (!isGroup) return reply(mess.only.group)
				    	if (!isBotGroupAdmins) return reply(mess.only.Badmin)
				    	linkgc = await client.groupInviteCode (from)
				    	yeh = `https://chat.whatsapp.com/${linkgc}\n\nlink Group *${groupName}*`
				    	client.sendMessage(from, yeh, text, {quoted: mek})
			        	break
					
				case 'tagall':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `?????? @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					mentions(teks, members_id, true)
					break
					
				case 'clearall':
					if (!isOwner) return reply(' *YO SOY QUIEN* ?')
					anu = await client.chats.all()
					client.setMaxListeners(25)
					for (let _ of anu) {
						client.deleteChat(_.jid)
					}
					reply('???????????????????????? ???????????????? ???????? ?????????????????????? ???????? ????????????  :)')
					break
					
			       case 'block':
				 	client.updatePresence(from, Presence.composing) 
				 	client.chatRead (from)
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(mess.only.ownerB)
					client.blockUser (`${body.slice(7)}@c.us`, "add")
					client.sendMessage(from, `perintah Diterima, memblokir ${body.slice(7)}@c.us`, text)
					break
					
                    		case 'unblock':
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(mess.only.ownerB)
				    	client.blockUser (`${body.slice(9)}@c.us`, "remove")
					client.sendMessage(from, `???????????????????????????????? ????????????????????????????????, ???????????????????????????? ${body.slice(9)}@c.us`, text)
					break
					
				case 'leave': 
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(mess.only.ownerB)
					await client.leaveGroup(from, '????????????????', groupId)
                    			break
					
				case 'bc': 
					if (!isOwner) return reply(' *YO SOY QUIEN* ?') 
					if (args.length < 1) return reply('.......')
					anu = await client.chats.all()
					if (isMedia && !mek.message.videoMessage || isQuotedImage) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						buff = await client.downloadMediaMessage(encmedia)
						for (let _ of anu) {
							client.sendMessage(_.jid, buff, image, {caption: `??? ???????????????????? ???????????????????????????????????? ???\n\n${body.slice(4)}`})
						}
						reply('?????????????????????????????????? ???????? ?????????????????????????? ')
					} else {
						for (let _ of anu) {
							sendMess(_.jid, `??? ???????????????????? ???????????????????????????????????? ???\n\n${body.slice(4)}`)
						}
						reply('?????????????????????????????????? ???????? ?????????????????????????? ')
					}
					break
					
			   	case 'setpp': 
                        		if (!isGroup) return reply(mess.only.group)
                       			if (!isGroupAdmins) return reply(mess.only.admin)
                        		if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                       			media = await client.downloadAndSaveMediaMessage(mek)
                         		await client.updateProfilePicture (from, media)
                        		reply('???????????????????????? ???????????????????????????? ???????? ???????????????????? ???????? ????????????????????')
                			break
					
				case 'add':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args.length < 1) return reply('??Quieres agregar a alguien?')
					if (args[0].startsWith('08')) return reply('Utilice el c??digo de pa??s, mas')
					try {
						num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
						client.groupAdd(from, [num])
					} catch (e) {
						console.log('Error :', e)
						reply('No se pudo agregar el destino, tal vez porque es privado, F')
					}
					break
					
				case 'grup':
				case 'group':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args[0] === 'buka') {
					    reply(`?????????????????????????????? ???????????????????????????? ???????????????????? ????????????`)
						client.groupSettingChange(from, GroupSettingChange.messageSend, false)
					} else if (args[0] === 'tutup') {
						reply(`???????????????????????????????? ???????????????????????????? ???????????????????? ????????????`)
						client.groupSettingChange(from, GroupSettingChange.messageSend, true)
					}
					break
                    
            			case 'admin':
            			case 'owner':
            			case 'creator':
                  			client.sendMessage(from, {displayname: "Jeff", vcard: vcard}, MessageType.contact, { quoted: mek})
       					client.sendMessage(from, 'Este es mi n??mero de propietario >_<, no enviar spam ni bloquearlo',MessageType.text, { quoted: mek} )
           				break
					
           			case 'setname':
                			if (!isGroup) return reply(mess.only.group)
			    		if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                			client.groupUpdateSubject(from, `${body.slice(9)}`)
                			client.sendMessage(from, '??xito, cambiar el nombre del grupo', text, {quoted: mek})
                			break
					
                		case 'setdesc':
                			if (!isGroup) return reply(mess.only.group)
			    		if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                			client.groupUpdateDescription(from, `${body.slice(9)}`)
                			client.sendMessage(from, '??xito, cambio de descripci??n del grupo', text, {quoted: mek})
               	 			break
					
           			case 'demote':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('???????????????????????????????? ???????? ???????????????????????????????? ???????????? ???????????????????????????? ???????????????????????? ????????????????????????????!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `???????????????????????? ???????????????????? :\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						client.groupDemoteAdmin(from, mentioned)
					} else {
						mentions(`???????????????????? @${mentioned[0].split('@')[0]} ???????????????????????? ????????????????????`, mentioned, true)
						client.groupDemoteAdmin(from, mentioned)
					}
					break
					
				case 'promote':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('???????????????????????????????? ???????? ???????????????????????????????? ???????????? ???????????????????????????? ???????????????????????? ????????????????????!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `???????????????????????????????????????????????????????? ???????????? ???????????????????????????????????????????? ???????? ???????????????????? ????????????????????:\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						client.groupMakeAdmin(from, mentioned)
					} else {
						mentions(`???????????????????????????????????????????????????????????? @${mentioned[0].split('@')[0]} ???????????? ???????????????????????????????????????????? ???????? ???????????????????? ???????????? ???????????????????? (+_+)`, mentioned, true)
						client.groupMakeAdmin(from, mentioned)
					}
					break
					
			     	case 'kick':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('???????????????????????????????? ???????? ???????????????????????????????? ???????????? ???????????????????????????? MATAR')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `???????????????? ???????????????????? ????????????????????????????,???????????? ???????????????? ???? :\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`CHAU CTMR @${mentioned[0].split('@')[0]} ????`, mentioned, true)
						client.groupRemove(from, mentioned)
					}
					break
					
				case 'listadmin':
					if (!isGroup) return reply(mess.only.group)
					teks = `LISTA DE ADMINS DEL GRUPO *${groupMetadata.subject}*\n???????????????????? : ${groupAdmins.length}\n\n`
					no = 0
					for (let admon of groupAdmins) {
						no += 1
						teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
					}
					mentions(teks, groupAdmins, true)
					break
					
				case 'toimg':
					if (!isQuotedSticker) return reply('???????????????????????????????? ???????? ???????????????????????????? !')
					reply(mess.wait)
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Bueno, fall?? ;( , intenta repetir :v')
						buffer = fs.readFileSync(ran)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: '????????????????????, ???????????????????? ???????????????????????? '})
						fs.unlinkSync(ran)
					})
					break
					
				case 'simih':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Boo :????')
					if (Number(args[0]) === 1) {
						if (isSimi) return reply('???????? ???????????????????????????????? !!!')
						samih.push(from)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('??? ?????????????????????? ??? ???????????????????????????? ???????????? ???????????????????????????????????? ???????????????? ???????? ???????????????? ????????????????????')
					} else if (Number(args[0]) === 0) {
						samih.splice(from, 1)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('??? ?????????????????????? ??? ???????????????????????????????????????? ???????????? ???????????????????????????????????? ???????????????? ???????? ???????????????? ????????????????????')
					} else {
						reply(' *Escriba el comando 1 para activar, 0 para desactivar* \nEJEMLPO: ???????????????????? ????')
					}
					break
					
				case 'nsfw':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Boo :????')
					if (Number(args[0]) === 1) {
						if (isNsfw) return reply('???????? ?????????????????????????????? !!')
						nsfw.push(from)
						fs.writeFileSync('./src/nsfw.json', JSON.stringify(nsfw))
						reply('??? ?????????????????????? ??? ???????????????????????????? ???????? ???????????????? ????????????????????????????????')
					} else if (Number(args[0]) === 0) {
						nsfw.splice(from, 1)
						fs.writeFileSync('./src/nsfw.json', JSON.stringify(nsfw))
						reply('??? ?????????????????????? ??? ???????????????????????????? ???????? ???????????????? ????????????????????????????????')
					} else {
						reply(' *1 PARA ACTIVAR, 0 PARA APAGAR* \nEJEMPLO: ???????????????? ????')
					}
					break
					
				case 'exclusive':
					if (!isOwner) return reply(mess.only.ownerB)
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Boo :????')
					if (Number(args[0]) === 1) {
					if (isNsfw) return reply('???????? ????????????????????????!!')
					nsfw.push(from)
					fs.writeFileSync('./src/exclusive.json', JSON.stringify(nsfw))
					reply('??? ?????????????????????? ??? ???????????????????????????? ????????????????????????????????')
					} else if (Number(args[0]) === 0) {
					nsfw.splice(from, 1)
					fs.writeFileSync('./src/exclusive.json', JSON.stringify(nsfw))
					reply('??? ?????????????????????? ??? *FUNCION DESACTIVADA*')
					} else {
					reply(' *1 PARA ACTIVAR, 0 PARA APAGAR* \nEJEMPLO: #exclusive ????')
					}
					break		
					
				case 'welcome':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Boo :????')
					if (Number(args[0]) === 1) {
						if (isWelkom) return reply('ACTIVADO !!!')
						welkom.push(from)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('??? ?????????????????????? ??? ???????????????????????????? ???????? ???????????????????????????????????????? ???????????????????????????????? ')
					} else if (Number(args[0]) === 0) {
						welkom.splice(from, 1)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('??? ?????????????????????? ??? ???????????????????????????? ???????? ???????????????????????????????????????? ???????????????????????????????????????????? ')
					} else {
						reply(' *1 PARA ACTIVAR, 0 PARA APAGAR* \n *EJEMPLO: ${prefix}welcome 1*')
					}
					break
					
				case 'clone':
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(' *YO SOY* ?') 
					if (args.length < 1) return reply(' *QUIERO ETIQUETAS EN EL CLON >:v !!!* ')
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag cvk')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid[0]
					let { jid, id, notify } = groupMembers.find(x => x.jid === mentioned)
					try {
						pp = await client.getProfilePicture(id)
						buffer = await getBuffer(pp)
						client.updateProfilePicture(botNumber, buffer)
						mentions(`La foto de perfil se actualiz?? correctamente con la foto de perfil @${id.split('@')[0]}`, [jid], true)
					} catch (e) {
						reply(' *Bueno, fall?? ;( , intenta repetir :v* ')
					}
					break
		
				case 'termux':
					if (!isExclusive) return reply('los comandos no estan activo')
                    			client.sendMessage(from, 'estos son los comnados de legion',MessageType.text, { quoted: mek} )
           				break

				case 'tr-troyano':
					if (!isExclusive) return reply('los comandos no estan activo')
					client.sendMessage(from, '???????????????????????????????????????????????????????????????\n\n$ pkg upgrade\n\n$ pkg install bash\n\n$ apt install pv\n\n$ pkg install git\n\n$ git clone https://github.com/Hacking-pch/papaviruz\n\n$ cd papaviruz\n\n$ chmod +x papaviruz.sh\n\n$ bash papaviruz.sh',MessageType.text, { quoted: mek} )
					break
				case 'tr-fotosploit':
					if (!isExclusive) return reply('los comandos no estan activo')
					client.sendMessage(from, '???????????????????????????????????????????????????????????????\n\n$ pkg update && pkg upgrade -y\n\n$ pkg install -y php\n\n$ pkg install -y python2\n\n$ pkg install -y git\n\n$ cd $HOME\n\n$ git clone https://github.com/Cesar-Hack-Gray/FotoSploit\n\n$ cd FotoSploit\n\n$ ls\n\n$ bash install.sh\n\n$ ./FotoSploit',MessageType.text, { quoted: mek} )
					break

				case 'tr-spam-mj':
					if (!isExclusive) return reply('los comandos no estan activo')
					client.sendMessage(from, '???????????????????????????????????????????????????????????????\n\n$ pkg update && pkg upgrade -y\n\n$ pkg install -y python\n\n$ pkg install -y git\n\n$ git clone https://github.com/TheSpeedX/TBomb\n\n$ ls\n\n$ cd TBomb\n\n$ ./TBomb.sh',MessageType.text, { quoted: mek} )
					break

				case 'tr-hack-facek':
					if (!isExclusive) return reply('los comandos no estan activo')
					client.sendMessage(from, '???????????????????????????????????????????????????????????????\n\n$ apt update && pkg upgrade -y\n\n$ pkg install git -y\n\n$ git clone https://github.com/Cesar-Hack-Gray/scam\n\n$ cd scam\n\n$ ls\n\n$ bash install.sh\n\n$ ls\n\n$ ./phishing.sh',MessageType.text, { quoted: mek} )
					break	
					
				case 'blowjob1':
					if (!isNsfw) return reply('los comandos no estan activo')
					ranp = getRandom('.gif')
					rano = getRandom('.webp')
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/nsfwblowjob?apikey=BotWeA`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					exec(`wget ${anu.result} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=15 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
					fs.unlinkSync(ranp)
					if (err) return reply(ind.stikga())
					buffer = fs.readFileSync(rano)
					client.sendMessage(from, buffer, sticker, {quoted: mek})
					fs.unlinkSync(rano)
					})
					break
					
				case 'nangis1':
					ranp = getRandom('.gif')
					rano = getRandom('.webp')
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/cry?apikey=BotWeA`, {method: 'get'})
					reply('?????????ESPERA UN MINUTO S?? HERMANO')
					if (anu.error) return reply(anu.error)
					exec(`wget ${anu.result} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=15 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
							  fs.unlinkSync(ranp)
							  if (err) return reply(ind.stikga())
							  buffer = fs.readFileSync(rano)
							  client.sendMessage(from, buffer, sticker, {quoted: mek})
							  fs.unlinkSync(rano)
						  })
					break
					
				case 'cium1':
					ranp = getRandom('.gif')
					rano = getRandom('.webp')
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/kiss?apikey=BotWeA`, {method: 'get'})
					reply('????????? ESPERA UN MINUTO S?? HERMANO')
						  if (anu.error) return reply(anu.error)
						  exec(`wget ${anu.result} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=15 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
							  fs.unlinkSync(ranp)
							  if (err) return reply(ind.stikga())
							  buffer = fs.readFileSync(rano)
							  client.sendMessage(from, buffer, sticker, {quoted: mek})
							  fs.unlinkSync(rano)
						  })
						  break
					
					case 'peluk1':
						  ranp = getRandom('.gif')
						  rano = getRandom('.webp')
						  anu = await fetchJson(`https://tobz-api.herokuapp.com/api/hug?apikey=BotWeA`, {method: 'get'})
						  reply('????????? AMOR Pausa 1 MINUTO FUERA ESTE S?? HERMANO')
						  if (anu.error) return reply(anu.error)
						  exec(`wget ${anu.result} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=15 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
							  fs.unlinkSync(ranp)
							  if (err) return reply(ind.stikga())
							  buffer = fs.readFileSync(rano)
							  client.sendMessage(from, buffer, sticker, {quoted: mek})
							  fs.unlinkSync(rano)
						  })
						  break
			
				case 'wait':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						reply(mess.wait)
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						media = await client.downloadMediaMessage(encmedia)
						await wait(media).then(res => {
							client.sendMessage(from, res.video, video, {quoted: mek, caption: res.teks.trim()})
						}).catch(err => {
							reply(err)
						})
					} else {
						reply(' *???????????????????????? ???????????????????? ???????????? ?????????????????????????????????????? ????????????* ')
					}
					break
					default:
						if (isGroup && isSimi && budy != undefined) {
						console.log(budy)
						muehe = await simih(budy)
						console.log(muehe)
						reply(muehe)
					} else {
						console.log(color('[ERROR]','red'), '......', color(sender.split('@')[0]))
					}
					}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
