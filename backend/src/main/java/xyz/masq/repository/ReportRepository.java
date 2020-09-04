package xyz.masq.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import xyz.masq.entity.Report;

public interface ReportRepository extends PagingAndSortingRepository<Report, Integer> {

}
