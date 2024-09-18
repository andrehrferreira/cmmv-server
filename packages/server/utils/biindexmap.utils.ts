
export class BiIndexMap {
    private index: Map<string, Map<string, any>>;
    private indexRegExp: Map<string, Array<{ regexp: RegExp, data: any }>>;

    constructor(){
        this.index = new Map();
        this.indexRegExp = new Map();
    }

    public set(index: string, index2: string | string[] | RegExp, data: any): void {
        index = index.toUpperCase();

        if (!this.index.has(index) && !(index2 instanceof RegExp)) 
            this.index.set(index, new Map());

        else if (!this.indexRegExp.has(index) && (index2 instanceof RegExp)) 
            this.indexRegExp.set(index, []);

        if(!(index2 instanceof RegExp)){
            const subIndex = this.index.get(index);

            if (Array.isArray(index2)) {
                index2.forEach(p => subIndex.set(p, data));
            } else if(typeof index2 === "string") {
                subIndex.set(index2, data);
            }
        }
        else {
            const subIndexRegexp = this.indexRegExp.get(index);
            subIndexRegexp.push({ regexp: index2, data });
        }
    }

    public get(index, index2): any | undefined {
        index = index.toUpperCase();
        const subIndex = this.index.get(index);

        if (subIndex && subIndex.has(index2)) {
            return subIndex.get(index2);
        }

        const subIndexRegexp = this.indexRegExp.get(index);

        if (subIndexRegexp) {
            for (const { regexp, data } of subIndexRegexp) {
                if (regexp.test(index2)) 
                    return data;
            }
        }
        
        return undefined;
    }

    public has(index, index2): boolean {
        index = index.toUpperCase();

        const subIndex = this.index.get(index);
        if (subIndex && subIndex.has(index2)) {
            return true;
        }

        const subIndexRegexp = this.indexRegExp.get(index);

        if (subIndexRegexp) {
            for (const { regexp } of subIndexRegexp) {
                if (regexp.test(index2)) 
                    return true;
            }
        }

        return false;
    }
}