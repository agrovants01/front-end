interface UserBase {
  usuarioId: string;
  perfilUsuario: string;
}

export interface UserList extends UserBase {
  nombreUsuario: string;
  apellidoUsuario: string;
  aliasUsuario: string;
  emailUsuario: string;
  telefonoUsuario: string;
  cuitUsuario: string;
}

export interface UserLogin extends UserBase {
  emailUsuario: string;
  contraseniaUsuario: string;
}

export interface UserLoginResponse extends UserBase {
  tokenUsuario: string;
}
