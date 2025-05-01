export const generateCombinedUid = (uid1: string, uid2: string): string => {
	return uid1 < uid2 ? uid1 + "--" + uid2 : uid2 + "--" + uid1
}
