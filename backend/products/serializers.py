from rest_framework import serializers
from .models import Product, Category

class ProductSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name", read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source="category",
        queryset=Category.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Product
        fields = ["id", "name", "price", "in_stock", "category", "category_id"]

    def validate_price(self, value):
        if value is None:
            raise serializers.ValidationError("Preço é obrigatório.")
        if value < 0:
            raise serializers.ValidationError("Preço não pode ser negativo.")
        return value

    def validate_name(self, value):
        value = (value or "").strip()
        if not value:
            raise serializers.ValidationError("Nome é obrigatório.")
        return value