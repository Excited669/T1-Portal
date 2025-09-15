let _token: string | null = null;
const KEY = 'auth.accessToken';

let _role: string | null = null;
const ROLE_KEY = 'auth.accessRole';

export function setToken(t : string | null){
    _token = t;
    if( t ) sessionStorage.setItem(KEY,t);
    else sessionStorage.removeItem(KEY);
}

export function getToken(): string | null {
    return _token ?? sessionStorage.getItem(KEY);
}

export function loadTokenOnBoot(){
    _token  =sessionStorage.getItem(KEY);
}

export function setRole(r : string | null){
    _role = r;
    if( r ) sessionStorage.setItem(ROLE_KEY,r);
    else sessionStorage.removeItem(ROLE_KEY);
}

export function getRole(): string | null {
    return _role ?? sessionStorage.getItem(ROLE_KEY);
}

function parseJwt(token: string) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
  
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

export function getUserDetails(){
    const token = getToken();
    if( token ){
        const decoded = parseJwt(token);
        return decoded;
    }
    return null;
}