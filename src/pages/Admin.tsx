import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GradientBackground from "@/components/GradientBackground";
import useSeo from "@/hooks/useSeo";
import { useNavigate } from "react-router-dom";
import { Plus, ScrollText, List } from "lucide-react";

const Admin = () => {
    const navigate = useNavigate();
    useSeo({ title: "Admin - เมนูจัดการ" });

    return (
        <>
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold">แอดมิน · เมนูจัดการ</h1>
                    <p className="text-muted-foreground mt-2">เลือกเมนูเพื่อจัดการวัดและเซียมซี</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <Card className="p-6 bg-card/90 border-border/50 flex flex-col items-start">
                        <div className="flex items-center gap-3 mb-4">
                            <List className="w-5 h-5" />
                            <h2 className="text-xl font-semibold">รายการวัด</h2>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">ดูรายชื่อวัดทั้งหมด และไปเพิ่มเซียมซี</p>
                        <Button onClick={() => navigate("/fortune/admin/temples")}>ไปที่รายการวัด</Button>
                    </Card>

                    <Card className="p-6 bg-card/90 border-border/50 flex flex-col items-start">
                        <div className="flex items-center gap-3 mb-4">
                            <Plus className="w-5 h-5" />
                            <h2 className="text-xl font-semibold">เพิ่มวัดใหม่</h2>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">สร้างวัดใหม่พร้อมรายละเอียด</p>
                        <Button onClick={() => navigate("/fortune/admin/temples/new")}>เพิ่มวัด</Button>
                    </Card>

                    <Card className="p-6 bg-card/90 border-border/50 flex flex-col items-start">
                        <div className="flex items-center gap-3 mb-4">
                            <ScrollText className="w-5 h-5" />
                            <h2 className="text-xl font-semibold">เพิ่มเซียมซี</h2>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">เพิ่มใบเซียมซีให้วัดที่เลือก</p>
                        <Button onClick={() => navigate("/fortune/admin/fortunes/new")}>เพิ่มเซียมซี</Button>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Admin;



