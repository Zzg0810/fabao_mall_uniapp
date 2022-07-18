const regPhone = /^1(2|3|4|5|6|7|8|9)\d{9}$/// 银行卡的正则
const regBankCard = /^([1-9]{1})(\d{14}|\d{18})$/
const regColor = /^(#){1}([0-9 a-f A-F]){6}$/
const regEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
const regPassword = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]{6,}$/
export {
	regPhone,
	regBankCard,
	regColor,
	regEmail,
	regPassword
}