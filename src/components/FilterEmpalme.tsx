import { useConductorsQuantities, useMaxVoltages, useShieldTypes } from "../client/hooks";
import Card, { CardContent, CardTitle } from "./Card";
import { Chip, SkeletonChip } from "./Chip";
import { useState } from 'preact/hooks'

export default function FilterEmpalme() {

    const [maxVoltages, error1] = useMaxVoltages();
    const [maxConductorsQuantities, error2] = useConductorsQuantities();
    const [shieldTypes, error3] = useShieldTypes()

    const [maxVoltage, setMaxVoltage] = useState<string | null>(null);
    const [conductorsQuantity, setConductorsQuantity] = useState<string | null>(null);
    const [shieldType, setShieldType] = useState<string | null>(null);

    return (
        <div>
            <div class="mb-3">
                <Card>
                    <CardTitle>Tensión máxima</CardTitle>
                    <CardContent>
                        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(70px,1fr)' }}>
                            {!maxVoltages && <div className="flex gap-2">
                                <SkeletonChip width="70px" />
                                <SkeletonChip width="70px" />
                                <SkeletonChip width="70px" />
                                <SkeletonChip width="70px" />
                            </div>}
                            {maxVoltages?.map(v => <Chip selected={maxVoltage === v} onClick={() => setMaxVoltage(v)}>{v}</Chip>)}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div class="mb-3">
                <Card>
                    <CardTitle>Cantidad de conductores</CardTitle>
                    <CardContent>
                        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(70px,1fr)' }}>
                            {!maxConductorsQuantities && <div className="flex gap-2">
                                <SkeletonChip width="70px" />
                                <SkeletonChip width="70px" />
                                <SkeletonChip width="70px" />
                                <SkeletonChip width="70px" />
                            </div>}
                            {maxConductorsQuantities?.map(v => <Chip selected={conductorsQuantity === v} onClick={() => setConductorsQuantity(v)}>{v}</Chip>)}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div class="mb-3">
                <Card>
                    <CardTitle>Tipo de pantalla</CardTitle>
                    <CardContent>
                        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr)' }}>
                            {!shieldTypes && <div className="flex gap-2">
                                <SkeletonChip width="140px" />
                                <SkeletonChip width="140px" />
                            </div>}
                            {shieldTypes?.map(v => <Chip selected={shieldType === v} onClick={() => setShieldType(v)}>{v}</Chip>)}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}