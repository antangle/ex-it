import { Module } from '@nestjs/common';
import { PrometheusModule } from '../prometheus/prometheus.module';
import { PrometheusService } from '../prometheus/prometheus.service';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

@Module({
  providers: [MetricsService, PrometheusService],
  controllers: [MetricsController]
})
export class MetricsModule {}
