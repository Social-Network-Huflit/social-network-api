import { JwtPayload } from "jsonwebtoken";

type JWTPayload = JwtPayload & {
    userId: string;
}

export default JWTPayload;