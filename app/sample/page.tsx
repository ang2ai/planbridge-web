"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import {
  MOCK_PRODUCTS,
  CATEGORIES_DEPTH1,
  STATUS_OPTIONS,
  POLICY_MAP,
  type Product,
} from "./mock-data";

// ── 금액 포맷 ──
function formatPrice(v: number) {
  return v.toLocaleString("ko-KR") + "원";
}

// ── 상태 뱃지 색상 ──
const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  SALE: "default",
  SOLDOUT: "outline",
  HIDDEN: "secondary",
  DELETED: "destructive",
};
const statusLabel: Record<string, string> = {
  SALE: "판매중",
  SOLDOUT: "품절",
  HIDDEN: "숨김",
  DELETED: "삭제",
};

// ================================================================
export default function SamplePage() {
  // ── 정책 데이터를 DOM에 노출 ──
  // Chrome Extension Content Script는 Isolated World에서 실행되어
  // 페이지의 window 객체에 접근 불가 → 숨겨진 DOM 요소로 정책 데이터 전달
  useEffect(() => {
    const el = document.createElement("div");
    el.id = "__planbridge_policies__";
    el.setAttribute("hidden", "");
    el.setAttribute("data-pb-internal", "true");
    el.textContent = JSON.stringify(POLICY_MAP);
    document.body.appendChild(el);
    console.log("[PlanBridge] Policy data injected:", Object.keys(POLICY_MAP).length, "keys");
    return () => { el.remove(); };
  }, []);

  // ── 검색 상태 ──
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("전체");
  const [searchStatus, setSearchStatus] = useState("ALL");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [searchSeller, setSearchSeller] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<Product[]>([]);

  // ── 그리드 선택 / 수정 ──
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editData, setEditData] = useState<Partial<Product>>({});

  // ── 검색 실행 ──
  const handleSearch = useCallback(() => {
    let filtered = [...MOCK_PRODUCTS];
    if (searchName) filtered = filtered.filter((p) => p.productName.includes(searchName));
    if (searchCategory !== "전체") filtered = filtered.filter((p) => p.categoryDepth1 === searchCategory);
    if (searchStatus !== "ALL") filtered = filtered.filter((p) => p.status === searchStatus);
    if (priceMin) filtered = filtered.filter((p) => p.price >= Number(priceMin));
    if (priceMax) filtered = filtered.filter((p) => p.price <= Number(priceMax));
    if (searchSeller) filtered = filtered.filter((p) => p.seller.includes(searchSeller));
    setResults(filtered);
    setSearched(true);
    setSelectedProduct(null);
    setEditData({});
  }, [searchName, searchCategory, searchStatus, priceMin, priceMax, searchSeller]);

  // ── 행 선택 ──
  const handleRowClick = (product: Product) => {
    setSelectedProduct(product);
    setEditData({ ...product });
  };

  return (
    <div
      data-pb-id="SamplePage"
      data-pb-type="page"
      className="space-y-4"
    >
      {/* ── 헤더 ── */}
      <PageHeader
        title="상품 관리"
        description="FreshMart 어드민 — 상품 조회/수정 샘플 (PlanBridge Extension으로 요소를 선택하세요)"
      />

      {/* ============================================================ */}
      {/* 검색 영역                                                     */}
      {/* ============================================================ */}
      <Card
        data-pb-id="SamplePage.SearchForm"
        data-pb-type="component"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-base">검색 조건</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* 1행 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div
              data-pb-id="SamplePage.SearchForm.ProductNameInput"
              data-pb-type="element"
              className="space-y-1"
            >
              <label className="text-xs font-medium text-muted-foreground">상품명</label>
              <Input
                placeholder="상품명 검색 (2자 이상)"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>

            <div
              data-pb-id="SamplePage.SearchForm.CategorySelect"
              data-pb-type="element"
              className="space-y-1"
            >
              <label className="text-xs font-medium text-muted-foreground">카테고리</label>
              <Select value={searchCategory} onValueChange={setSearchCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES_DEPTH1.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div
              data-pb-id="SamplePage.SearchForm.StatusSelect"
              data-pb-type="element"
              className="space-y-1"
            >
              <label className="text-xs font-medium text-muted-foreground">상태</label>
              <Select value={searchStatus} onValueChange={setSearchStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div
              data-pb-id="SamplePage.SearchForm.PriceRange"
              data-pb-type="element"
              className="space-y-1"
            >
              <label className="text-xs font-medium text-muted-foreground">가격 범위</label>
              <div className="flex gap-1 items-center">
                <Input
                  type="number"
                  placeholder="최소"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="text-sm"
                />
                <span className="text-muted-foreground text-xs">~</span>
                <Input
                  type="number"
                  placeholder="최대"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* 2행 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div
              data-pb-id="SamplePage.SearchForm.SellerInput"
              data-pb-type="element"
              className="space-y-1"
            >
              <label className="text-xs font-medium text-muted-foreground">판매자</label>
              <Input
                placeholder="판매자명"
                value={searchSeller}
                onChange={(e) => setSearchSeller(e.target.value)}
              />
            </div>

            <div
              data-pb-id="SamplePage.SearchForm.DateRange"
              data-pb-type="element"
              className="space-y-1"
            >
              <label className="text-xs font-medium text-muted-foreground">등록일</label>
              <div className="flex gap-1 items-center">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="text-sm"
                />
                <span className="text-muted-foreground text-xs">~</span>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="flex items-end col-span-2 gap-2">
              <Button
                data-pb-id="SamplePage.SearchForm.SearchButton"
                data-pb-type="element"
                onClick={() => handleSearch()}
                className="gap-2"
              >
                <Search className="h-4 w-4" />
                검색
              </Button>
              <Button
                data-pb-id="SamplePage.SearchForm.ResetButton"
                data-pb-type="element"
                variant="outline"
                onClick={() => {
                  setSearchName("");
                  setSearchCategory("전체");
                  setSearchStatus("ALL");
                  setPriceMin("");
                  setPriceMax("");
                  setSearchSeller("");
                  setDateFrom("");
                  setDateTo("");
                  setResults([]);
                  setSearched(false);
                  setSelectedProduct(null);
                }}
              >
                초기화
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================================ */}
      {/* 그리드 + 수정 패널                                            */}
      {/* ============================================================ */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* ── 그리드 ── */}
        <Card
          data-pb-id="SamplePage.ProductGrid"
          data-pb-type="component"
          className={selectedProduct ? "lg:col-span-2" : "lg:col-span-3"}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                상품 목록
                {searched && (
                  <Badge variant="secondary" className="ml-2">
                    {results.length}건
                  </Badge>
                )}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {!searched ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                검색 조건을 설정하고 검색 버튼을 클릭하세요.
              </p>
            ) : results.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                검색 결과가 없습니다.
              </p>
            ) : (
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        data-pb-id="SamplePage.ProductGrid.ProductIdCell"
                        data-pb-type="element"
                      >
                        상품ID
                      </TableHead>
                      <TableHead>상품명</TableHead>
                      <TableHead>카테고리</TableHead>
                      <TableHead
                        data-pb-id="SamplePage.ProductGrid.PriceCell"
                        data-pb-type="element"
                      >
                        가격
                      </TableHead>
                      <TableHead>할인율</TableHead>
                      <TableHead>재고</TableHead>
                      <TableHead
                        data-pb-id="SamplePage.ProductGrid.StatusCell"
                        data-pb-type="element"
                      >
                        상태
                      </TableHead>
                      <TableHead>판매자</TableHead>
                      <TableHead>등록일</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((p) => (
                      <TableRow
                        key={p.productId}
                        className={`cursor-pointer ${
                          selectedProduct?.productId === p.productId
                            ? "bg-blue-50 dark:bg-blue-950"
                            : ""
                        }`}
                        onClick={() => handleRowClick(p)}
                      >
                        <TableCell className="font-mono text-xs">{p.productId}</TableCell>
                        <TableCell className="font-medium">{p.productName}</TableCell>
                        <TableCell className="text-xs">{p.categoryDepth1} &gt; {p.categoryDepth2}</TableCell>
                        <TableCell>
                          {p.discountRate > 0 ? (
                            <div>
                              <span className="line-through text-muted-foreground text-xs mr-1">
                                {formatPrice(p.price)}
                              </span>
                              <span className="font-semibold text-red-600">
                                {formatPrice(Math.round(p.price * (1 - p.discountRate / 100)))}
                              </span>
                            </div>
                          ) : (
                            formatPrice(p.price)
                          )}
                        </TableCell>
                        <TableCell>{p.discountRate > 0 ? `${p.discountRate}%` : "-"}</TableCell>
                        <TableCell>{p.stock.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant[p.status] ?? "default"}>
                            {statusLabel[p.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>{p.seller}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{p.createdAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── 수정 패널 ── */}
        {selectedProduct && (
          <Card
            data-pb-id="SamplePage.EditPanel"
            data-pb-type="component"
            className="lg:col-span-1"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">상품 수정</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedProduct(null);
                    setEditData({});
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-3">
                <div className="space-y-4">
                  {/* 상품 ID (읽기전용) */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      상품 ID <span className="text-[10px]">(읽기전용)</span>
                    </label>
                    <Input value={selectedProduct.productId} disabled className="font-mono" />
                  </div>

                  {/* 상품명 */}
                  <div
                    data-pb-id="SamplePage.EditPanel.ProductNameField"
                    data-pb-type="element"
                    className="space-y-1"
                  >
                    <label className="text-xs font-medium text-muted-foreground">상품명 *</label>
                    <Input
                      value={editData.productName ?? ""}
                      onChange={(e) => setEditData({ ...editData, productName: e.target.value })}
                      placeholder="상품명 (2~100자)"
                    />
                  </div>

                  {/* 가격 */}
                  <div
                    data-pb-id="SamplePage.EditPanel.PriceField"
                    data-pb-type="element"
                    className="space-y-1"
                  >
                    <label className="text-xs font-medium text-muted-foreground">가격 (원) *</label>
                    <Input
                      type="number"
                      value={editData.price ?? ""}
                      onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })}
                      placeholder="100 ~ 10,000,000"
                    />
                  </div>

                  {/* 할인율 */}
                  <div
                    data-pb-id="SamplePage.EditPanel.DiscountField"
                    data-pb-type="element"
                    className="space-y-1"
                  >
                    <label className="text-xs font-medium text-muted-foreground">할인율 (%)</label>
                    <Input
                      type="number"
                      value={editData.discountRate ?? ""}
                      onChange={(e) => setEditData({ ...editData, discountRate: Number(e.target.value) })}
                      placeholder="0 ~ 90"
                      min={0}
                      max={90}
                    />
                    {(editData.discountRate ?? 0) > 90 && (
                      <p className="text-xs text-red-600">할인율이 너무 높습니다 (최대 90%)</p>
                    )}
                  </div>

                  {/* 재고 */}
                  <div
                    data-pb-id="SamplePage.EditPanel.StockField"
                    data-pb-type="element"
                    className="space-y-1"
                  >
                    <label className="text-xs font-medium text-muted-foreground">재고</label>
                    <Input
                      type="number"
                      value={editData.stock ?? ""}
                      onChange={(e) => setEditData({ ...editData, stock: Number(e.target.value) })}
                      min={0}
                    />
                  </div>

                  {/* 상태 */}
                  <div
                    data-pb-id="SamplePage.EditPanel.StatusField"
                    data-pb-type="element"
                    className="space-y-1"
                  >
                    <label className="text-xs font-medium text-muted-foreground">상태</label>
                    <Select
                      value={editData.status}
                      onValueChange={(v) => setEditData({ ...editData, status: v as Product["status"] })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SALE">판매중</SelectItem>
                        <SelectItem value="SOLDOUT">품절</SelectItem>
                        <SelectItem value="HIDDEN">숨김</SelectItem>
                        <SelectItem value="DELETED">삭제</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* 저장 / 취소 */}
                  <div className="flex gap-2">
                    <Button
                      data-pb-id="SamplePage.EditPanel.SaveButton"
                      data-pb-type="element"
                      className="flex-1"
                      onClick={() => {
                        alert(`저장 완료 (mock): ${editData.productName}`);
                      }}
                    >
                      저장
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedProduct(null);
                        setEditData({});
                      }}
                    >
                      취소
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
