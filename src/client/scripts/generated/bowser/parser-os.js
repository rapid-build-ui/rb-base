import Utils from"./utils.js";import{OS_MAP}from"./constants.js";export default[{test:[/Roku\/DVP/],describe(t){const e=Utils.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i,t);return{name:OS_MAP.Roku,version:e}}},{test:[/windows phone/i],describe(t){const e=Utils.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i,t);return{name:OS_MAP.WindowsPhone,version:e}}},{test:[/windows/i],describe(t){const e=Utils.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i,t),s=Utils.getWindowsVersionName(e);return{name:OS_MAP.Windows,version:e,versionName:s}}},{test:[/macintosh/i],describe(t){const e=Utils.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i,t).replace(/[_\s]/g,".");return{name:OS_MAP.MacOS,version:e}}},{test:[/(ipod|iphone|ipad)/i],describe(t){const e=Utils.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i,t).replace(/[_\s]/g,".");return{name:OS_MAP.iOS,version:e}}},{test(t){const e=!t.test(/like android/i),s=t.test(/android/i);return e&&s},describe(t){const e=Utils.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i,t),s=Utils.getAndroidVersionName(e),i={name:OS_MAP.Android,version:e};return s&&(i.versionName=s),i}},{test:[/(web|hpw)[o0]s/i],describe(t){const e=Utils.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i,t),s={name:OS_MAP.WebOS};return e&&e.length&&(s.version=e),s}},{test:[/blackberry|\bbb\d+/i,/rim\stablet/i],describe(t){const e=Utils.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i,t)||Utils.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i,t)||Utils.getFirstMatch(/\bbb(\d+)/i,t);return{name:OS_MAP.BlackBerry,version:e}}},{test:[/bada/i],describe(t){const e=Utils.getFirstMatch(/bada\/(\d+(\.\d+)*)/i,t);return{name:OS_MAP.Bada,version:e}}},{test:[/tizen/i],describe(t){const e=Utils.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i,t);return{name:OS_MAP.Tizen,version:e}}},{test:[/linux/i],describe:()=>({name:OS_MAP.Linux})},{test:[/CrOS/],describe:()=>({name:OS_MAP.ChromeOS})},{test:[/PlayStation 4/],describe(t){const e=Utils.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i,t);return{name:OS_MAP.PlayStation4,version:e}}}];